const Files = require("../../db/models/filesSchema");
const AWS = require("aws-sdk");

export {};

async function traverseDirectory(parentID, folderString, directoryStructure) {
  const result = await Files.find({ parent: parentID });

  for (let i = 0; i < result.length; i++) {
    const file = result[i];
    if (file.directory) {
      await traverseDirectory(
        file._id,
        folderString + file.name + "/",
        directoryStructure
      );
    } else {
      directoryStructure.push({
        folderPath: folderString,
        fileName: file.name,
        fileKey: file._id.toString(),
      });
    }
  }
}

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
