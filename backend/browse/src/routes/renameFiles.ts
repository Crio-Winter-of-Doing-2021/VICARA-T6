import express, { Request, Response } from "express";

import {File} from '../models/file.model';

const router = express.Router();

router.patch("/api/browse/rename", async (req: Request, res: Response) => {
    const { id, name, parent } = req.body;

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
