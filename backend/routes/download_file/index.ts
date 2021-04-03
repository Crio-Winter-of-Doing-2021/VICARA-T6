const downloadFile = require("express").Router();
const AWS = require("aws-sdk");
const currentUserMiddleware = require("../middleware");

export {};

downloadFile.get(
  "/",
  currentUserMiddleware.currentUser,
  async (req, res, next) => {
    const ownerID = req.currentUser.id;
    let { file: fileID, name: fileName } = req.query;

    const s3 = new AWS.S3();

    const fetchFileParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: ownerID + "/" + fileID,
    };

    const signedURLParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: ownerID + "/" + fileID,
      Expires: 60,
      ResponseContentDisposition: 'attachment; filename ="' + fileName + '"',
    };

    try {
      s3.getObject(fetchFileParams, function (err, data) {
        if (err === null) {
          console.log(data);

          if (data.ContentLength > 1000 * 1024 * 1000) {
            // size > 100MB
            console.log("SIZE EXCEEDED");

            const url = s3.getSignedUrl("getObject", signedURLParams);

            console.log(url);

            //Send the pre - signed url
            res.status(200).send({ url });
          } else {
            //Send the blob file
            res.status(200).send(data.Body);
          }
        } else {
          res.status(500).send(err);
        }
      });

      // res.status(200).send(url);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = downloadFile;
