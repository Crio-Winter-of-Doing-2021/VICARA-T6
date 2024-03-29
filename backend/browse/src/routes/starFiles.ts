import express, { Request, Response } from "express";

import { checkUpdateIdParam } from "../util/checkParams";
import { File } from "../models/file.model";
import { BadUploadRequestError } from "@vic-common/common";

const router = express.Router();

router.get("/api/browse/star", async (req: Request, res: Response) => {
  const ownerId = req.currentUser!.id;

  const starredFiles = await File.find({ ownerId, starred: true });

  return res.send(starredFiles);
});

router.patch("/api/browse/star/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = req.currentUser!.id;

  let err = await checkUpdateIdParam(id, ownerId);
  if (err.length !== 0) {
    return res.status(400).send({err: 'Invalid request'});
  }

  const fileDetails = await File.findById(id);

  if (fileDetails!.starred === true) {
    const updatedFile = await File.findByIdAndUpdate(id, { starred: false });
    res.send(updatedFile);
  } else {
    const updatedFile = await File.findByIdAndUpdate(id, { starred: true });
    res.send(updatedFile);
  }
});

export { router as starRouter };
