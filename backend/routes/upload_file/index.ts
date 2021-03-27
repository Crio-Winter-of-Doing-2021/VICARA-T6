const uploadFile = require("express").Router();
const AWS = require("aws-sdk");
const Files = require("../../db/models/filesSchema");

export {};

async function upload(filename, file) {
  let s3 = new AWS.S3({
    params: { Bucket: process.env.S3_BUCKET_NAME, Key: filename, Body: file },
    options: { partSize: 5 * 1024 * 1024, queueSize: 10 }, // 5 MB
  });

  try {
    const data = await s3
      .upload()
      .on("httpUploadProgress", function (evt) {
        console.log(evt);
      })
      .promise();

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

uploadFile.post("/", async (req, res, next) => {
  let { owner: ownerID } = req.query;

  let uploadStartTime = new Date(),
    busboyFinishTime = null,
    s3UploadFinishTime = null;

  let filesCount = 0,
    finished = false;

  req.busboy.on(
    "file",
    async (fieldname, file, filename, encoding, mimetype) => {
      const parentID = fieldname;

      //Check if file already exists
      const result = await Files.findOne({
        parent: parentID,
        name: filename,
        owner: ownerID,
      });

      if (result === null) {
        ++filesCount;
      }

      file.on("end", function () {
        // console.log("ENDED");
        // res.json({ msg: "ENDED" })
      });

      file.on("data", function (data) {
        // console.log("DATA FOUND");
      });

      if (result === null) {
        const new_file = new Files({
          name: filename,
          directory: false,
          owner: ownerID,
          parent: parentID,
          type: "image",
          extension: "jpeg",
          size: "1024",
        });

        upload(new_file._id.toString(), file)
          .then(async (data) => {
            console.log(data);
            await new_file.save();
            await Files.findByIdAndUpdate(new_file._id, { url: data.Location });
            filesCount--;
            console.log("ADDED");

            if (filesCount === 0 && finished) {
              console.log("Finished Uploading");
              res.json("OK").status(200);
            }
          })
          .catch(async (err) => {
            console.log(err);
            // console.log("REMOVED");
            filesCount--;
          });
      } else {
        console.log("FILE ALREADY EXISTS");

        if (filesCount === 0 && finished) {
          console.log("Finished Uploading");
          res.json("OK").status(200);
        }
      }

      console.log({ filesCount });

      if (busboyFinishTime && s3UploadFinishTime) {
        console.log("FINAL CALL HERE");
      }
    }
  );

  req.busboy.on("finish", function () {
    // send response
    console.log("Done parsing form!");
    finished = true;

    if (busboyFinishTime && s3UploadFinishTime) {
      console.log({
        uploadStartTime: uploadStartTime,
        busboyFinishTime: busboyFinishTime,
        s3UploadFinishTime: s3UploadFinishTime,
      });
    }
  });

  req.busboy.on("end", function () {
    // console.log("WHO ENDED ME");
  });

  req.pipe(req.busboy); // Pipe it trough busboy
});

module.exports = uploadFile;
