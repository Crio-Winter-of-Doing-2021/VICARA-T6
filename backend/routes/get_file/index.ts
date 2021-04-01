const getFile = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

getFile.get("/", async (req, res, next) => {
  let { parent } = req.query;

  try {
    //Find the folder with the owner and parent folder id as url
    const result = await Files.findById(parent);

    res.send(result);
  } catch (error) {
    //Return empty folder in case of error
    res.send({
      err: "File Not Found",
    });
  }
});

module.exports = getFile;
