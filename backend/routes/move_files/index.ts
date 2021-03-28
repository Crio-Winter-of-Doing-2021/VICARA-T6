const moveFiles = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

moveFiles.post("/", async (req, res, next) => {
  let { foldersList, parentID } = req.body;

  Object.keys(foldersList).map(async (id: any) => {
    await Files.findByIdAndUpdate(id, { parent: parentID });
  });

  res.send("OK");
});

module.exports = moveFiles;
