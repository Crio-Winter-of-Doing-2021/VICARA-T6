import express, {Request, Response} from "express";
import {body} from "express-validator";
import validator from "validator";

import {BadRequestError, requireAuth} from "@vic-common/common";
import {File, FileDoc} from '../models/file.model';
import {StorageTypes, DeleteFileFailed} from "../storage/Storage.model";
import {StorageFactory} from '../storage/Storage.factory';

const router = express.Router();

router.delete('/api/files/delete',
    body('files')
        .isArray({min: 1})
        .withMessage('A valid fileId array should be provided'),
    async (req: Request, res: Response) => {
    // Saves deleted files
    const resFiles: (FileDoc | DeleteFileFailed)[] = [];
    // Get fileId array
    const {files} = req.body;
    // Request userId
    const reqUserId = req.currentUser!.id;

    for (let i = 0; i < files.length; i++) {
        const fileId = files[i];
        if (!validator.isMongoId(fileId)) {
            resFiles.push({
                fileId,
                errCode: 400,
                errors: [{
                    field: 'fileId',
                    message: 'Invalid fileId'
                }]
            });
            continue;
        }
        try {
            const fileToDelete = await File.findOne({_id: fileId, ownerId: reqUserId});
            if (!fileToDelete) {
                throw new BadRequestError('File not found');
            }
            const deleteId = fileToDelete._id.toHexString();
            const storage = StorageFactory.getStorage(StorageTypes.S3);
            await storage.deleteFile(deleteId);
            await File.findByIdAndDelete(deleteId);
            resFiles.push(fileToDelete);
        } catch (err) {
            if (err instanceof BadRequestError) {
                resFiles.push({
                    fileId,
                    errCode: 400,
                    errors: [{
                        message: 'Invalid request'
                    }]
                });
            } else {
                resFiles.push({
                    fileId,
                    errCode: 500,
                    errors: [{
                        message: 'Error deleting file from server'
                    }]
                });
            }
        }
    }
    res.send(resFiles);
});

export { router as deleteFileRouter };
