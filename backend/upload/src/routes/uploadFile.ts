import express, {Request, Response} from "express";
import Busboy from 'busboy';
import meter from 'stream-meter';

import {File} from '../models/file.model';
import { StorageFactory } from '../storage/Storage.factory';
import { StorageTypes } from '../storage/Storage.model';

const router = express.Router();

router.post("/api/files/upload",
    async (req: Request, res: Response) => {
        const ownerId = req.currentUser!.id;
        let response: {}[] = [];

        const busboy = new Busboy({headers: req.headers});

        console.log({busboy});

        let filesCount = 0,
            finished = false;

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
                    fileName,
                    ownerId,
                });

                if (result === null) {
                    ++filesCount;
                } else {
                    response.push({
                        name: result.fileName,
                        status: "Failure",
                        message: "Filename already exists",
                    });
                }

                file.on("end", function () {
                    console.log("ENDED");
                    // res.json({ msg: "ENDED" })
                });

                file.on("data", function (data: any) {
                    // console.log("DATA FOUND");
                });

                console.log(filesCount);

                if (result === null) {
                    const new_file = File.buildFile({
                        fileName,
                        isDirectory: false,
                        ownerId,
                        parentId,
                        mimetype,
                    });
                    const s3 = StorageFactory.getStorage(StorageTypes.S3);
                    const smeter = meter();
                    const {writeStream, promise: uploadPromise} = s3.uploadFile(new_file._id.toHexString(), ownerId);
                    try {
                        file.pipe(smeter).pipe(writeStream);
                        const result = await uploadPromise;
                        console.log({result});
                        new_file.fileSize = smeter.bytes;
                        console.log(new_file);
                        await new_file.save();
                    } catch (err) {
                        response.push({
                            name: new_file.fileName,
                            status: "Failure",
                            message: err.message,
                        });
                    }
                    filesCount--;
                    console.log("ADDED");
                    response.push({
                        name: new_file.fileName,
                        status: "Success",
                        message: "File upload successfully",
                    });
                }

                if (filesCount === 0 && finished) {
                    console.log("Finished Uploading");
                    res.send(response);
                }

                console.log({ filesCount, finished });
            }
        );

        busboy.on("finish", function () {
            // send response
            console.log("Done parsing form!");
            finished = true;

            if (filesCount === 0 && finished) {
                console.log("Finished Uploading");
                res.send(response);
            }
        });

        busboy.on("end", function () {
            // console.log("WHO ENDED ME");
        });

        req.pipe(busboy); // Pipe it trough busboy
    }
);

export {router as uploadFileRouter}
