const downloadFile = require("express").Router();
const AWS = require("aws-sdk");

export {};

downloadFile.get("/", async (req, res, next) => {
  let { file: fileID } = req.query;

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileID,
  };

  try {
    s3.getObject(params, function (err, data) {
      if (err === null) {
        res.send(data.Body);
      } else {
        res.status(500).send(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = downloadFile;
