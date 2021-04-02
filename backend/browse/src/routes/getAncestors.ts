import express, {Request, Response} from "express";
import {body} from "express-validator";
import {File} from '../models/file.model';

import {NotFoundError, validateRequest} from "@vic-common/common";
import {getAncestors} from "../util/getParents";

const router = express.Router();

router.get('/api/browse/ancestors', [
    body('id')
        .isMongoId()
        .withMessage('Invalid id')
], validateRequest, async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const reqId = req.body.id;
    const reqFile = await File.findOne({
        ownerId,
        _id: reqId
    });
    if (!reqFile) {
        throw new NotFoundError('Resource not found');
    }

    const ancestors = await getAncestors(ownerId, reqId);
    res.send({ancestors});
})

export {router as ancestorRouter}
