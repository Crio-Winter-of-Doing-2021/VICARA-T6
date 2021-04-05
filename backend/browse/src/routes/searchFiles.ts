import express, {Request, Response} from "express";

import {File} from '../models/file.model';

const router = express.Router();

router.get("/api/browse/search", async (req: Request, res: Response) => {

    const ownerId = req.currentUser!.id;

    if (!req.query.text) {
        return res.send([]);
    }

    const searchText = req.query.text as string;

    if (searchText.trim().length === 0) {
        return res.send([]);
    }


    const result = await File.find({
        fileName: { $regex: searchText, $options: "i" },
        ownerId
    });

    return res.json({ searchFilesResult: result });
});

export {router as searchFileRouter};
