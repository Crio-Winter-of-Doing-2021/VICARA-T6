import express, {Request, Response} from "express";

import { checkUpdateIdParam, checkFileNameParam, checkParentParam } from '../util/checkParams';
import {File} from '../models/file.model';
import {BadUploadRequestError} from "@vic-common/common";

const router = express.Router();

router.patch('/api/browse/update', async (req:Request, res: Response) => {
    const {id, newParent, newFileName} = req.body;
    const ownerId = req.currentUser!.id;
    let err = await checkUpdateIdParam(ownerId, id);
    if (err.length !== 0) {
        throw new BadUploadRequestError(err);
    }
    const changes: {parentId?: string, fileName?: string} = {};
    if (newParent) {
        err = await checkParentParam(newParent, ownerId);
        if (err.length !== 0) {
            throw new BadUploadRequestError(err);
        }
        changes.parentId = newParent;
    }
    if (newFileName) {
        err = await checkFileNameParam(newFileName, ownerId, newParent);
        if (err.length !== 0) {
            throw new BadUploadRequestError(err);
        }
        changes.fileName = newFileName;
    }
    const updatedFile = await File.findByIdAndUpdate(id, {
        ...changes
    });
    res.send(updatedFile);
});

export {router as fileUpdateRouter};
