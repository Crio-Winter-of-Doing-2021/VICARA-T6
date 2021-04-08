import express, { Request, Response } from "express";
import { File } from "../models/file.model";

const router = express.Router();

router.get("/api/browse/storage", async (req: Request, res: Response) => {
  const ownerId = req.currentUser!.id;
  const TOTAL_ALLOTTED_SIZE = 1024 * 1024 * 1024;

  const totalUsedSize = await File.aggregate([
    {
      $match: {
        $and: [
          {
            ownerId,
          },
          {
            isDirectory: false,
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$fileSize",
        },
      },
    },
  ]);

  return res.send({
    TOTAL_ALLOTTED_SIZE,
    totalUsedSize: totalUsedSize?.[0]?.total ?? 0,
  });
});

export { router as storageRouter };
