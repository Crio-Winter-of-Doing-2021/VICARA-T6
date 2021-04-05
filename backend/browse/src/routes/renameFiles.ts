import express, { Request, Response } from "express";
import {body} from 'express-validator';

import {File} from '../models/file.model';
import {isFilenameValid} from "../util/checkParams";

const router = express.Router();

router.patch("/", [
    body('id')
        .isMongoId()
        .withMessage('Invalid id'),
    body('parent')
        .isMongoId()
        .withMessage('Invalid parent id')
], async (req: Request, res: Response) => {
    const { id, name, parent } = req.body;

    if (!name || isFilenameValid(name)) {
        return res.send({err: "Invalid new name"});
    }

    try {
        const exists = await File.findOne({
            fileName: name,
            parentId: parent
        });

        if (exists) {
            res.status(400).send({
                err: "File Already exists with that name",
            });
        } else {
            const result = await File.findByIdAndUpdate(id, { fileName: name });

            res.send(result);
        }
    } catch (error) {
        //Return empty folder in case of error
        res.send({
            err: "File Not Found",
        });
    }
});

export {router as fileRenameRouter};
