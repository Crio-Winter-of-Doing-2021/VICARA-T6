import express, { Request, Response } from "express";
import { File } from "../models/file.model";

import { NotFoundError } from "@vic-common/common";
import { getAncestors } from "../util/getParents";

const router = express.Router();

router.get(
  "/api/browse/ancestors",
  async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const parentId = req.query.id as string;

    const reqFile = await File.findOne({
      ownerId,
      _id: parentId,
    });

    if (!reqFile) {
      throw new NotFoundError("Resource not found");
    }

    const ancestors = await getAncestors(ownerId, parentId);

    const reversedAncestors = ancestors.reverse();

    res.send({ reversedAncestors });
  }
);

export { router as ancestorRouter };
