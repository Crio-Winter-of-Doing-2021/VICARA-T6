const downloadFolder = require("express").Router();
const createMiddleware = require("./middleware");
const S3Zipper = require("./aws-s3-zipper");

const config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET_NAME,
};

const zipper = new S3Zipper(config);

export {};

downloadFolder.post("/", createMiddleware.directory, async (req, res, next) => {
  //Get folderName from middleware
  const { folderName } = req;

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    res.set("content-type", "application/zip"); // optional
    zipper.streamZipDataTo(
      {
        pipe: res,
        folderName,
        startKey: null, // could keep null
        recursive: true,
      },
      function (err, result) {
        if (err) console.error(err);
        else {
          console.log("SUCCESSFULLY ZIPPED");
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

module.exports = downloadFolder;
