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
    // s3.getObject(params, function (err, data) {
    //   if (err === null) {
    //     res.send(data.Body);
    //   } else {
    //     res.status(500).send(err);
    //   }
    // });

    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: "606639090da8d65590e754f5",
      Expires: 60,
      ResponseContentDisposition: 'attachment; filename ="' + "video.mkv" + '"',
    });

    res.status(200).send(url);
  } catch (error) {
    console.log(error);
  }
});

module.exports = downloadFile;
