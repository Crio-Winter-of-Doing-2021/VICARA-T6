const starredFiles = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

starredFiles.get("/", async (req, res, next) => {
  const result = await Files.find({ starred: true });

  return res.json({ starredFilesResult: result }).status(200);
});

starredFiles.post("/", async (req, res, next) => {
  const { fileID } = req.body;

  const result = await Files.findById(fileID);

  if (result?.starred === true) {
    await Files.findByIdAndUpdate(fileID, { starred: false });
  } else {
    await Files.findByIdAndUpdate(fileID, { starred: true });
  }

  return res.send().status(200);
});

module.exports = starredFiles;
