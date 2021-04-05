import express, {Request, Response} from "express";
import {File} from "../models/file.model";
import {param} from "express-validator";
import {NotFoundError, validateRequest} from "@vic-common/common";

const router = express.Router();

router.get('/api/browse/file/:id', [
        param('id')
            .isMongoId()
            .withMessage('Invalid directory id')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const reqFileId = req.params.id;
    const reqFile = await File.findOne({
        _id: reqFileId,
        ownerId
    });
    if (!reqFile) {
        throw new NotFoundError('Resource not found');
    }
    const children = await File.find({
        parentId: reqFile._id,
        ownerId,
    });
    const resFile = reqFile.toObject();
    resFile.id = resFile._id;
    delete resFile._id;
    const response = {
        ...resFile,
        children
    };
    res.send(response);
});

export {router as getFileRouter};
