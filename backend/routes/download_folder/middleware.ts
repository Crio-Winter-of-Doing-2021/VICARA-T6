const AWS = require("aws-sdk");
const Files = require("../../db/models/filesSchema");
const traverseDirectory = require("../../utils/helper/db_traversal");

export {};

const createMiddleware = {
  directory: async function (req, res, next) {
    let { folder: folderID } = req.query;
    const result = await Files.findById(folderID);

    let folderString = result.name + "/";
    let directoryStructure = [];

    await traverseDirectory(folderID, folderString, directoryStructure);

    const s3 = new AWS.S3({
      params: { Bucket: process.env.S3_BUCKET_NAME },
      region: process.env.S3_REGION,
    });

    for (let i = 0; i < directoryStructure.length; i++) {
      const { fileName, fileKey, folderPath } = directoryStructure[i];

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        CopySource: process.env.S3_BUCKET_NAME + "/" + fileKey,
        Key: folderPath + fileName,
      };

      s3.copyObject(params, function (copyErr, copyData) {
        if (copyErr) {
          console.log(copyErr);
        } else {
          console.log("Copied: ", params.Key);
        }
      });
    }

    req.folderName = result.name;

    next();
  },
};

module.exports = createMiddleware;
