const uploadFile = require("express").Router();
const AWS = require("aws-sdk");
const meter = require("stream-meter");
const stream = require("stream");
const mongoose = require("mongoose");
const Files = require("../../db/models/filesSchema");
const currentUserMiddleware = require("../middleware");

export {};

function upload(filename) {
  const passStream = new stream.PassThrough();

  const params = {
    Key: filename,
    Bucket: process.env.S3_BUCKET_NAME,
    Body: passStream,
  };
  // Concurrency of 10, 5Mb buffers
  const opts = {
    queueSize: 10,
    partSize: 1024 * 1024 * 5,
  };

  const s3 = new AWS.S3();

  return {
    uploadPromise: s3.upload(params, opts).promise(),
    passStream,
  };
}

uploadFile.post(
  "/",
  currentUserMiddleware.currentUser,
  async (req, res, next) => {
    const ownerID = req.currentUser.id;

    let uploadStartTime = new Date(),
      busboyFinishTime = null,
      s3UploadFinishTime = null;

    let filesCount = 0,
      finished = false;

    // let arr = [
    //   {
    //     name,
    //     status: Success | Faile,
    //     message: "Uploaded SUcce",
    //   },
    // ];

    const result = await Files.aggregate([
      {
        $match: {
          $and: [
            {
              owner: new mongoose.Types.ObjectId("606832abfc9be470485d947a"),
            },
            {
              directory: false,
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$size",
          },
        },
      },
    ]);

    req.busboy.on(
      "file",
      async (fieldname, file, filename, encoding, mimetype) => {
        const smeter = meter();

        const parentID = fieldname;
        const fileExt = filename.split(".").pop();

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
          console.log("DATA FOUND");
        });

        if (result === null) {
          const new_file = new Files({
            name: filename,
            directory: false,
            starred: false,
            owner: ownerID,
            parent: parentID,
            type: mimetype,
            extension: fileExt,
          });

          const uploadResult = <any>(
            upload(ownerID + "/" + new_file._id.toString())
          );

          file.pipe(smeter).pipe(uploadResult.passStream);

          const result = await uploadResult.uploadPromise;

          new_file.size = smeter.bytes;

          console.log(new_file);

          await new_file.save();

          filesCount--;
          console.log("ADDED");

          if (filesCount === 0 && finished) {
            console.log("Finished Uploading");
            res.json("OK").status(200);
          }
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
  }
);

module.exports = uploadFile;
