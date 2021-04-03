const AWS = require("aws-sdk");
const copyFiles = require("express").Router();
const Files = require("../../db/models/filesSchema");
const traverseDirectory = require("../../utils/helper/db_traversal");
const currentUserMiddleware = require("../middleware");

export {};

const s3 = new AWS.S3();

async function copyFolderUtility(
  parent_id: string,
  ownerID: string,
  folder_id: string
): Promise<void> {
  const result = await Files.findById(folder_id);
  let folderString = result.name + "/";
  //Add the initial folder id to the arr
  let directoryStructure = [
    {
      folderPath: folderString,
      ...JSON.parse(JSON.stringify(result)),
    },
  ];
  let directoryMapper = {};
  //Traverse the children and get their IDs
  await traverseDirectory(folder_id, folderString, directoryStructure, true);

  //Root folder
  let tempExisting = directoryStructure[0];
  const fileID = tempExisting._id;
  tempExisting = JSON.parse(JSON.stringify(tempExisting));
  //Delete unecessary data
  delete tempExisting._id;
  delete tempExisting.updatedAt;
  delete tempExisting.createdAt;
  tempExisting.parent = parent_id;
  const new_file = new Files(tempExisting);
  await new_file.save();
  // console.log("Duplicate File Created in DB");
  directoryMapper[fileID] = new_file._id;

  //Inner folders
  for (let i = 1; i < directoryStructure.length; i++) {
    let tempExisting = directoryStructure[i];
    const fileID = tempExisting._id;
    tempExisting = JSON.parse(JSON.stringify(tempExisting));
    //Delete unecessary data
    delete tempExisting._id;
    delete tempExisting.updatedAt;
    delete tempExisting.createdAt;

    if (directoryMapper[tempExisting.parent] !== undefined) {
      console.log("EXISTS : ", tempExisting.name, fileID, tempExisting.parent);
      tempExisting.parent = directoryMapper[tempExisting.parent];
    } else {
      console.log(
        "DOES NOT EXISTS : ",
        tempExisting.name,
        fileID,
        tempExisting.parent
      );
      tempExisting.parent = parent_id;
    }

    const new_file = new Files(tempExisting);

    if (new_file.directory === false) {
      console.log(
        "Copying file with ID " + fileID + " to new ID " + new_file._id
      );
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        CopySource: process.env.S3_BUCKET_NAME + "/" + ownerID + "/" + fileID,
        Key: ownerID + "/" + new_file._id.toString(),
      };
      //Send the delete request
      try {
        await s3
          .copyObject(params, function (copyErr, copyData) {
            if (copyErr) {
              console.log(copyErr);
            } else {
              console.log("Copied: ", params.Key);
            }
          })
          .promise();
      } catch (error) {
        return Promise.reject();
      }
    }

    await new_file.save();
    console.log("Duplicate File Created in DB");
    directoryMapper[fileID] = new_file._id;
  }

  console.log(directoryMapper);

  return Promise.resolve();
}

async function copyFileUtility(
  parent_id: string,
  ownerID: string,
  files_id: string[]
): Promise<void> {
  var existingFile = await Files.findById(files_id);

  if (existingFile) {
    let tempExisting = existingFile;
    tempExisting = JSON.parse(JSON.stringify(tempExisting));
    //Delete unecessary data
    delete tempExisting._id;
    delete tempExisting.updatedAt;
    delete tempExisting.createdAt;
    tempExisting.parent = parent_id;
    const new_file = new Files(tempExisting);
    await new_file.save();
    console.log("Duplicate File Created in DB");

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      CopySource:
        process.env.S3_BUCKET_NAME + "/" + ownerID + "/" + existingFile._id,
      Key: ownerID + "/" + new_file._id.toString(),
    };

    await s3
      .copyObject(params, function (copyErr, copyData) {
        if (copyErr) {
          console.log(copyErr);
        } else {
          console.log("Copied: ", params.Key);
        }
      })
      .promise();
  } else {
    return Promise.reject();
  }

  return Promise.resolve();
}

copyFiles.post(
  "/",
  currentUserMiddleware.currentUser,
  async (req, res, next) => {
    let { foldersList, parentID } = req.body;
    const ownerID = req.currentUser.id;

    Object.entries(foldersList).map(async (fileDetails: any) => {
      const fileID = fileDetails[0];
      const data = fileDetails[1];

      if (data.isDirectory) {
        await copyFolderUtility(parentID, ownerID, fileID);
      } else {
        await copyFileUtility(parentID, ownerID, fileID);
      }
    });

    res.send("OK");
  }
);

module.exports = copyFiles;
