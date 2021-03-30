const AWS = require("aws-sdk");
const Files = require("../../db/models/filesSchema");
const traverseDirectory = require("../../utils/helper/db_traversal");

export {};

const createMiddleware = {
  directory: async function (req, res, next) {
    let { folder: folderIDs } = req.body;

    const s3 = new AWS.S3();

    let parentFolderString = "downloadFolder/";

    for (let i = 0; i < folderIDs.length; i++) {
      const result = await Files.findById(folderIDs[i]);

      if (result.directory) {
        let folderString = result.name + "/";

        let directoryStructure = [];
        await traverseDirectory(folderIDs[i], folderString, directoryStructure);

        for (let i = 0; i < directoryStructure.length; i++) {
          const {
            name: fileName,
            _id: fileKey,
            folderPath,
          } = directoryStructure[i];

          console.log({
            id: fileKey,
            folderPath: folderPath + fileName,
          });

          const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            CopySource: process.env.S3_BUCKET_NAME + "/" + fileKey,
            Key: parentFolderString + folderPath + fileName,
          };

          s3.copyObject(params, function (copyErr, copyData) {
            if (copyErr) {
              console.log(copyErr);
            } else {
              console.log("Copied: ", params.Key);
            }
          });
        }
      } else {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          CopySource: process.env.S3_BUCKET_NAME + "/" + result._id,
          Key: parentFolderString + result.name,
        };

        s3.copyObject(params, function (copyErr, copyData) {
          if (copyErr) {
            console.log(copyErr);
          } else {
            console.log("Copied: ", params.Key);
          }
        });
      }
    }

    req.folderName = "downloadFolder";
    next();
  },
};

module.exports = createMiddleware;
