import express, {Request, Response} from "express";
import {body} from 'express-validator';

import {File} from '../models/file.model';
import { validateRequest } from '@vic-common/common';

const router = express.Router();

router.get('/api/browse/file',
    [
        body('fileId')
            .isMongoId()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ownerId = req.currentUser!.id;
        const reqFileId = req.body.fileId;
        const reqFile = await File.findOne({
            _id: reqFileId,
            ownerId,
            isDirectory: false
        });
        if (!reqFile) {
            return res.status(404).send({
                message: 'Requested resource not found'
            });
        }
        res.send(reqFile);
    }
);

export {router as getFileRouter};
