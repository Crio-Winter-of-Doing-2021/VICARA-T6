const listDirectory = require("express").Router();
const Files = require("../../db/models/filesSchema");
const currentUserMiddleware = require("../middleware");

export {};

listDirectory.get(
  "/",
  currentUserMiddleware.currentUser,
  async (req, res, next) => {
    let { parent } = req.query;

    const ownerID = req.currentUser.id;

    const currentFolderData = await Files.findById(parent);

    try {
      //Find the folder with the owner and parent folder id as url
      const children = await Files.find({ owner: ownerID, parent }).sort({
        directory: -1,
        name: 1,
      });

      res.send({
        currentFolderData,
        children,
      });
    } catch (error) {
      //Return empty folder in case of error
      res.send({
        currentFolderData,
        children: [],
      });
    }
  }
);

module.exports = listDirectory;
