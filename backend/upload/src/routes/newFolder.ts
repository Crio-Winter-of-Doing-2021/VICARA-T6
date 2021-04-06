import express, { Request, Response } from "express";

import { requireAuth, validateRequest } from "@vic-common/common";
import {
  checkFolderUploadParams,
  createDirectories,
} from "../util/createDirectories";
import { body } from "express-validator";
import { BadUploadRequestError } from "@vic-common/common";

const router = express.Router();

router.post(
  "/api/folders/create",
  [
    body("parentId").isMongoId().withMessage("Invalid parentId"),
    body("paths").isArray({ min: 1 }).withMessage("Invalid paths array"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const parentId = req.body.parentId;
    const paths: string[] = req.body.paths;

    const errRes = await checkFolderUploadParams(parentId, ownerId, paths);
    if (errRes.length !== 0) {
      throw new BadUploadRequestError(errRes);
    }
    const pathsId = await createDirectories(ownerId, parentId, paths);
    res.send(pathsId);
  }
);

export { router as createFolderRouter };
