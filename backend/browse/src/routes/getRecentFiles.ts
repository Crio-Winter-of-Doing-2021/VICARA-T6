import express, { Request, Response } from "express";

import { File, FileDoc } from "../models/file.model";

const router = express.Router();

router.get("/api/browse/recent", async (req: Request, res: Response) => {
  const currentTime: Date = new Date();
  const ownerId = req.currentUser!.id;

  const result = await File.find({ ownerId })
    .sort({ _id: -1 })
    .limit(10);

  const recentFilesResult = result.filter((file: FileDoc) => {
    const fileUpdationDate: Date = new Date(file.createdAt);
    const diff: number =
      Math.abs(currentTime.valueOf() - fileUpdationDate.valueOf()) / 1000 / 60;

    //files which came under 10 minutes
    return diff <= 10;
  });

  return res.status(200).json({ recentFilesResult });
});

export { router as recentRouter };
