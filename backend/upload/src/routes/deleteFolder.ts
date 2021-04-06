import express, {Request, Response} from "express";
import {body} from "express-validator";

import {validateRequest} from "@vic-common/common";
import {File} from "../models/file.model";
import {deleteDirectory} from "../util/deleteDirectory";

const router = express.Router();

router.delete('/api/folders/delete',
    [
        body('folderId')
            .isMongoId()
            .withMessage('Not a valid folderId')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const folderId: string = req.body.folderId;
        const ownerId = req.currentUser!.id;
        const folderToDelete = await File.findOne({
            _id: folderId,
            ownerId,
            isDirectory: true
        });
        if (!folderToDelete) {
            return res.status(400).send({
                field: 'folderId',
                message: 'Invalid folderId for deletion'
            });
        }
        await deleteDirectory(folderToDelete._id.toHexString(), ownerId);
        res.send(folderToDelete);
    }
);

export {router as deleteFolderRouter};
