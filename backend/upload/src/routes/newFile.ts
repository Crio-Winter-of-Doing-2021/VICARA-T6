import express, {Request, Response} from "express";
import Busboy from 'busboy';
import meter from 'stream-meter';

import {requireAuth} from "@vic-common/common";
import {File, FileDoc} from '../models/file.model';
import {StorageFactory} from '../storage/Storage.factory';
import {StorageTypes, SaveFileFailed} from '../storage/Storage.model';
import {StorageError, BadUploadRequestError} from '@vic-common/common';
import {checkFileUploadParams} from "../util/checkParams";

const router = express.Router();

router.post('/api/files/upload', requireAuth,
    async (req: Request, res: Response) => {
    // Saves files to be returned
    const resFiles: (FileDoc | SaveFileFailed)[] = [];
    // Saves state of form being processed
    let filesBeingProcessed = 0;
    let doneParsingForm = false;
    // Busboy
    const busboy = new Busboy({headers: req.headers});

    busboy.on('file',
        async (
            fieldname,
            file,
            filename,
            encoding,
            mimetype
        ) => {
            filesBeingProcessed++;
            const storage = StorageFactory.getStorage(StorageTypes.S3);
            const parentId = fieldname;
            const fileName = filename;
            try {
                const check = await checkFileUploadParams(
                    { fileName, parentId },
                    req.currentUser!.id,
                    req.query.overwrite === 'true'
                );
                if (check.length !== 0) {
                    throw new BadUploadRequestError(check);
                }
                const newFile = File.buildFile({
                    fileName,
                    mimetype,
                    isDirectory: false,
                    parentId,
                    ownerId: req.currentUser!.id
                });
                // To measure length of stream
                const fileMeter = meter();
                const {writeStream, promise} =  storage.uploadFile(newFile._id.toHexString());
                // Write to storage and wait
                file.pipe(fileMeter).pipe(writeStream);
                await promise;
                // Set size of the file upload
                newFile.fileSize = fileMeter.bytes;
                // Save the file to database
                await newFile.save();
                // Add saved file to response object
                resFiles.push(newFile);
            } catch (err) {
                if (err instanceof BadUploadRequestError) {
                    resFiles.push({
                        parentId,
                        fileName,
                        errCode: 400,
                        errors: err.serializeErrors()
                    });
                } else {
                    resFiles.push({
                        parentId,
                        fileName,
                        errCode: 500,
                        errors:
                            new StorageError('Could not save the file to storage')
                                .serializeErrors()
                    });
                }
            } finally {
                filesBeingProcessed--;
                // If processing of all files completed return response
                if (doneParsingForm && filesBeingProcessed === 0) {
                    res.status(201).send({resFiles});
                }
            }
        }
    );

    busboy.on('finish', () => {
        doneParsingForm = true;
    });

    req.pipe(busboy);
});

export { router as createFileRouter };
