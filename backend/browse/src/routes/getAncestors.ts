import express, { Request, Response } from "express";
import { File } from "../models/file.model";

import { NotFoundError, validateRequest } from "@vic-common/common";
import { getAncestors } from "../util/getParents";
import validator from "validator";

const router = express.Router();

router.get(
  "/api/browse/ancestors",
  validateRequest,
  async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const parentId = req.query.id as string;

    console.log("#########################################");
    console.log({ parentId });
    console.log("#########################################");

    if (!parentId || validator.isMongoId(parentId)) {
      return res.send({
        err: "Not a valid parentId",
      });
    }

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
