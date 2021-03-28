const deleteFolder = require("express").Router();
const Files = require("../../db/models/filesSchema");
const AWS = require("aws-sdk");
const traverseDirectory = require("../../utils/helper/db_traversal");

export {};

deleteFolder.delete("/", async (req, res, next) => {
  let { file: folderID } = req.body;
  const result = await Files.findById(folderID);

  let folderString = result.name + "/";

  //Add the initial folder id to the arr
  let directoryStructure = [
    {
      folderPath: folderString,
      ...JSON.parse(JSON.stringify(result)),
    },
  ];

  const s3 = new AWS.S3();

  //Traverse the children and get their IDs
  await traverseDirectory(folderID, folderString, directoryStructure, true);

  //Traverse the resultant directory and delete the files/folders from S3 and DB
  for (let i = 0; i < directoryStructure.length; i++) {
    const { _id: fileID } = directoryStructure[i];

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileID,
    };

    //Send the delete request
    try {
      s3.deleteObject(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          throw new Error(err);
        }

        //Check if the object exists
        s3.getObject(params, async function (err, data) {
          if (!data || Object.keys(data).length === 0) {
            console.log("FILE SUCCESSFULL DELETED");
            //Remove the file entry from the DB
            await Files.findByIdAndRemove(fileID);
          } else {
            throw new Error(err);
          }
        });
      });
    } catch (error) {
      res.status(400).send(error);
      break;
    }
  }

  res.status(200).send("OK");
});

module.exports = deleteFolder;
