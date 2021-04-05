import express, { Request, Response } from "express";
import { Types } from "mongoose";
import { File } from "../models/file.model";

const router = express.Router();

router.get("/api/storage", async (req: Request, res: Response) => {
  const ownerId = req.currentUser!.id;
  const totalAllotedSize = 1024 * 1024 * 1024;

  const totalUsedSize = await File.aggregate([
    {
      $match: {
        $and: [
          {
            owner: new Types.ObjectId(ownerId),
          },
          {
            directory: false,
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$size",
        },
      },
    },
  ]);

  return res.send({
    totalAllotedSize: totalAllotedSize,
    totalUsedSize: totalUsedSize?.[0]?.total ?? 0,
  });
});

export { router as storageRouter };
