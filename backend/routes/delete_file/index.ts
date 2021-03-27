const deleteFile = require("express").Router();
const Files = require("../../db/models/filesSchema");
const AWS = require("aws-sdk");

export {};

deleteFile.delete("/", async (req, res, next) => {
  const { file: fileID } = req.body;

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileID,
  };

  //Send the delete request
  try {
    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        res.status(400).send(err);
      }

      //Check if the object exists
      s3.getObject(params, async function (err, data) {
        if (!data || Object.keys(data).length === 0) {
          console.log("FILE SUCCESSFULL DELETED");
          //Remove the file entry from the DB
          await Files.findByIdAndRemove(fileID);
          res.status(200).send("OK");
        } else {
          res.status(400).send(err);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = deleteFile;
