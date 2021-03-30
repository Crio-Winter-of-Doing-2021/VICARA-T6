const recentFiles = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

recentFiles.get("/", async (req, res, next) => {
  const currentTime: any = new Date();
  const result = await Files.find().sort({ _id: -1 }).limit(10);

  const recentFilesResult = result.filter((file) => {
    const fileUpdationDate: any = new Date(file.updatedAt);
    const diff: number = Math.abs(currentTime - fileUpdationDate) / 1000 / 60;

    //files which came under 10 minutes
    if (diff <= 10) {
      return true;
    }

    return false;
  });

  return res.json({ recentFilesResult }).status(200);
});

module.exports = recentFiles;
