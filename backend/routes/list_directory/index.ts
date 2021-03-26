const listDirectory = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

listDirectory.get("/", async (req, res, next) => {
  let { owner, parent } = req.query;

  const fileDetails = await Files.findOne({ _id: parent });

  try {
    //Find the folder with the owner and parent folder id as url
    const result = await Files.find({ owner, parent }).sort({
      directory: -1,
      name: 1,
    });

    res.send({
      currentFolderData: fileDetails,
      children: result,
    });
  } catch (error) {
    //Return empty folder in case of error
    res.send({
      currentFolderData: fileDetails,
      children: [],
    });
  }
});

module.exports = listDirectory;
