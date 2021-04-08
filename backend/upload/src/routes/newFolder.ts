import express, { Request, Response } from "express";

import {
  checkFolderUploadParams,
  createDirectories,
} from "../util/createDirectories";

const router = express.Router();

router.post(
  "/api/folders/create",
  async (req: Request, res: Response) => {
    const ownerId = req.currentUser!.id;
    const parentId = req.body.parentId;
    const paths: string[] = req.body.paths;

    const errRes = await checkFolderUploadParams(parentId, ownerId, paths);
    if (errRes.length !== 0) {
      return res.status(400).send({err: 'Invalid request'});
    }
    const pathsId = await createDirectories(ownerId, parentId, paths);
    res.send(pathsId);
  }
);

export { router as createFolderRouter };
