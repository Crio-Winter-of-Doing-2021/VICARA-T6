const listDirectory = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

listDirectory.get("/", async (req, res, next) => {
  let { owner, parent } = req.query;

  try {
    //Find the folder with the owner and parent folder id as url
    const result = await Files.find({ owner, parent });
    res.json(result);
  } catch (error) {
    //Return empty folder in case of error
    res.json([]);
  }
});

module.exports = listDirectory;
