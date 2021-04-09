import express, {Request, Response} from "express";
import Busboy from 'busboy';
import meter from 'stream-meter';

import { File } from '../models/file.model';
import { StorageFactory } from '../storage/Storage.factory';
import { StorageTypes } from '../storage/Storage.model';
import { getAvailableStorage } from '../util/getStorage';

const router = express.Router();

router.post("/api/files/upload",
    async (req: Request, res: Response) => {
        const ownerId = req.currentUser!.id;
        const response: {}[] = [];

        let availableStorage = await getAvailableStorage(ownerId);
        const busboy = new Busboy({
            headers: req.headers,
            highWaterMark: 10 * 1024 * 1024,
        });

        let filesCount = 0, finished = false;

        busboy.on(
            "file",
            async (
                fieldname,
                file,
                fileName,
                encoding,
                mimetype
            ) => {
                const parentId = fieldname;
                //Check if file already exists
                const result = await File.findOne({
                    parentId,
                    fileName,
                    ownerId,
                });

                file.on("end", function () {});

                file.on("data", function (data: any) {});

                if (result === null) {
                    ++filesCount;
                    const new_file = File.buildFile({
                        fileName,
                        isDirectory: false,
                        ownerId,
                        parentId,
                        mimetype,
                    });
                    const s3 = StorageFactory.getStorage(StorageTypes.S3);
                    const smeter = meter(availableStorage);
                    smeter.on("error", function (e) {
                        response.push({
                            name: 'Upload Restricted',
                            status: 'Failure',
                            message: 'You have exceeded your storage limit'
                        });
                        return res.send(response);
                    });
                    const {writeStream, promise: uploadPromise} = s3.uploadFile(new_file._id.toHexString(), ownerId);
                    try {
                        file.pipe(smeter).pipe(writeStream);
                        await uploadPromise;
                        new_file.fileSize = smeter.bytes;
                        await new_file.save();
                        availableStorage -= smeter.bytes;
                        if (availableStorage < 0) {
                            response.push({
                                name: 'Upload Restricted',
                                status: 'Failure',
                                message: 'You have exceeded your storage limit'
                            });
                            return res.send(response);
                        }
                        console.log('AVAILABLE_STORAGE_UPDATED_TO');
                        console.log({availableStorage});
                    } catch (err) {
                        response.push({
                            name: new_file.fileName,
                            status: "Failure",
                            message: err.message,
                        });
                    }
                    filesCount--;
                    response.push({
                        name: new_file.fileName,
                        status: "Success",
                        message: "File upload successfully",
                    });
                } else {
                    response.push({
                        name: result.fileName,
                        status: "Failure",
                        message: "Filename already exists",
                    });
                }
                if (filesCount === 0 && finished) {
                    res.send(response);
                }
            }
        );

        busboy.on("finish", function () {
            finished = true;
            if (filesCount === 0 && finished) {
                res.send(response);
            }
        });

        busboy.on("end", function () {});

        req.pipe(busboy);
    }
);

export {router as uploadFileRouter}
