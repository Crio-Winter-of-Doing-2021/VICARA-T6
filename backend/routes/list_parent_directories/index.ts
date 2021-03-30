const listParentDirectories = require("express").Router();
const Files = require("../../db/models/filesSchema");

import FilesSchema from "../../utils/interfaces/FilesSchema";

export {};

interface directoryRoutesSchema {
  id: string;
  name: string;
}

listParentDirectories.get("/", async (req, res, next) => {
  let { parent } = req.query;
  let directoryRoutes: directoryRoutesSchema[] = [];

  try {
    //Find the initial folder details
    let leafFileDetails: FilesSchema = await Files.findById(parent);

    //If name and id exists push them to the array
    if (leafFileDetails) {
      const { _id, name } = leafFileDetails;

      if (name && _id) {
        directoryRoutes.push({
          id: _id,
          name: name,
        });
      }

      //Update the parent of folder
      parent = leafFileDetails?.parent;

      //Find till the root parent is found
      while (leafFileDetails !== null) {
        leafFileDetails = await Files.findById(parent);

        if (leafFileDetails) {
          const { _id, name } = leafFileDetails;

          if (name && _id) {
            directoryRoutes.push({
              id: _id,
              name: name,
            });
          }
          parent = leafFileDetails?.parent;
        }
      }
    }

    //Add the details of the initial parent
    directoryRoutes.push({
      id: parent,
      name: "Home",
    });

    directoryRoutes = directoryRoutes.reverse();

    res.send({
      directoryRoutes,
    });
  } catch (error) {
    console.log(error);

    //Return empty folder in case of error
    res.send({
      directoryRoutes,
    });
  }
});

module.exports = listParentDirectories;
