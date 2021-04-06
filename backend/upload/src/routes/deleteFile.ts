import express, {Request, Response} from "express";

import {File} from '../models/file.model';
import {StorageTypes} from "../storage/Storage.model";
import {StorageFactory} from '../storage/Storage.factory';

const router = express.Router();

router.delete('/api/files/delete/:id',
    async (req: Request, res: Response) => {
        // Get fileId
        const fileId = req.params.id;
        // Request userId
        const ownerId = req.currentUser!.id;

        const fileToDelete = await File.findOne({_id: fileId, ownerId: ownerId});
        if (!fileToDelete) {
            return res.status(404).send({
                err: 'File not found'
            });
        }
        const deleteId = fileToDelete._id.toHexString();
        const storage = StorageFactory.getStorage(StorageTypes.S3);
        try {
            await storage.deleteFile(deleteId, ownerId);
        } catch (err) {
            console.log(`Unable to delete ${deleteId} from storage`);
        }
        try {
            await File.findByIdAndDelete(deleteId);
        } catch (err) {
            return res.status(500).send({err: 'Unable to delete file'});
        }
        res.send('Success');
});

export { router as deleteFileRouter };
