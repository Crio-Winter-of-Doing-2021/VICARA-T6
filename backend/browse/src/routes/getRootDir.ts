import express, {Request, Response} from "express";

import { File } from '../models/file.model';
import {NotFoundError} from "@vic-common/common";

const router = express.Router();

router.get('/api/browse/rootdir', async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const rootDir = await File.findOne({
        ownerId: ownerId,
        parentId: ownerId,
        isDirectory: true
    });
    if (!rootDir) {
        throw new NotFoundError('Resource not found');
    }
    const children = await File.find({
        parentId: rootDir._id,
        ownerId,
    });
    const resDir = rootDir.toObject();
    resDir.id = resDir._id;
    delete resDir._id;
    const response = {
        ...resDir,
        children
    };
    res.send(response);
});

export {router as getRootDirRouter};
