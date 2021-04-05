import express, {Request, Response} from "express";

import {File} from '../models/file.model';
import {validateRequest} from "@vic-common/common";
import {body} from "express-validator";

const router = express.Router();

router.patch('/api/browse/move', [
    body('foldersList')
        .isArray({min: 1})
        .withMessage('At least one file should be provided'),
    body('parentId')
        .isMongoId()
        .withMessage('Should be a valid mongoId')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;

    let { foldersList, parentId } = req.body;
    const newParentFolder = await File.findOne({
        _id: parentId,
        ownerId
    });
    if (!newParentFolder) {
        return res.send({err: "Invalid folder id"});
    }
    // Object.keys(foldersList).map(async (id: any) => {
    //     await File.findByIdAndUpdate(id, { parent: parentId });
    // });
    for (let i = 0; i < foldersList.length; i++) {
        await File.findByIdAndUpdate(foldersList[i], { parentId });
    }
    const newChildren = await File.find({ parentId });
    res.send(newChildren);
});

export {router as moveFileRouter};
