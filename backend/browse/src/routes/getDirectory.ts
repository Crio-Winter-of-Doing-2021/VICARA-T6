import express, {Request, Response} from "express";
import {File} from "../models/file.model";
import {param} from "express-validator";
import {NotFoundError, validateRequest} from "@vic-common/common";

const router = express.Router();

router.get('/api/browse/directory/:id', [
        param('id')
            .isMongoId()
            .withMessage('Invalid directory id')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const reqDirId = req.params.id;
    const reqDir = await File.findOne({
        _id: reqDirId,
        ownerId,
        isDirectory: true
    });
    if (!reqDir) {
        throw new NotFoundError('Resource not found');
    }
    const children = await File.find({
        parentId: reqDir._id,
        ownerId,
    });
    const resDir = reqDir.toObject();
    resDir.id = resDir._id;
    delete resDir._id;
    const response = {
        ...resDir,
        children
    };
    res.send(response);
});

export {router as getDirRouter};
