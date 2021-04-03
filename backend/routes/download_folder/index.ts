const downloadFolder = require("express").Router();
const createMiddleware = require("./middleware");
const S3Zipper = require("./aws-s3-zipper");
const AWS = require("aws-sdk");
const currentUserMiddleware = require("../middleware");

const config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET_NAME,
};

const zipper = new S3Zipper(config);

export {};

downloadFolder.post(
  "/",
  [currentUserMiddleware.currentUser, createMiddleware.directory],
  async (req, res, next) => {
    //Get folderName from middleware
    const ownerID = req.currentUser.id;
    const s3FileName = "folders.zip";
    const s3 = new AWS.S3();
    const { folderName } = req;
    // console.log(folderName);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      res.set("content-type", "application/zip"); // optional

      //Send the folder directly as a zip to frontend
      // zipper.streamZipDataTo(
      //   {
      //     pipe: res,
      //     folderName,
      //     startKey: null, // could keep null
      //     recursive: true,
      //   },
      //   function (err, result) {
      //     if (err) console.error(err);
      //     else {
      //       console.log("SUCCESSFULLY ZIPPED");
      //     }
      //   }
      // );

      zipper.zipToS3File(
        {
          s3FolderName: folderName,
          startKey: null, // optional
          s3ZipFileName: s3FileName,
          recursive: true,
          tmpDir: null, // optional, defaults to node_modules/aws-s3-zipper
        },
        function (err, result) {
          if (err) console.error(err);
          else {
            var lastFile = result.zippedFiles[result.zippedFiles.length - 1];
            if (lastFile) console.log("last key ", lastFile.Key); // next time start from here

            const downloadFolderParams = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: folderName + "/" + s3FileName,
              Expires: 60,
            };

            const deletionParams = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: folderName,
            };

            //Get presigned url
            const url = s3.getSignedUrl("getObject", downloadFolderParams);

            res.status(200).send({ url });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
);

module.exports = downloadFolder;
