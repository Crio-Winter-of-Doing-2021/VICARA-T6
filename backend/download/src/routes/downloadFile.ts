import express, {Request, Response} from "express";

import {StorageFactory} from '../storage/Storage.factory';
import {StorageTypes} from '../storage/Storage.model';
import {File} from '../models/file.model';

const router = express.Router();

router.get('/api/downloads/file/:id', async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const id = req.params.id;
    const fileToDownload = await File.findOne({
        _id: id,
        ownerId
    });
    if (!fileToDownload) {
        return res.status(404).send({err: 'File does not exist'});
    }
    const s3 = StorageFactory.getStorage(StorageTypes.S3);
    try {
        const responseS3 = await s3.downloadFile(id, ownerId, fileToDownload.fileName);
        if(!responseS3.Body) {
            return res.status(500).send({err: 'Could not find file in storage'});
        }
        return res.send(responseS3.Body);
    } catch (err) {
        return res.status(500).send({err: 'Could not find file in storage'});
    }
});

export {router as fileDownloadRouter}
