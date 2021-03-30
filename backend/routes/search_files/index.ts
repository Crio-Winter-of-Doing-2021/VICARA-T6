const searchFiles = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

searchFiles.get("/", async (req, res, next) => {
  //   Files.index({ name: "text" });

  const { text: searchText } = req.query;

  if (searchText.trim().length === 0) {
    return res.json({ searchFilesResult: [] }).status(200);
  }

  const result = await Files.find({
    name: { $regex: searchText, $options: "i" },
  });

  return res.json({ searchFilesResult: result }).status(200);
});

module.exports = searchFiles;
