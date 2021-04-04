const AWS = require("aws-sdk");
const shareableLink = require("express").Router();
const Files = require("../../db/models/filesSchema");
const currentUserMiddleware = require("../middleware");
const traverseDirectory = require("../../utils/helper/db_traversal");
const S3Zipper = require("../download_folder/aws-s3-zipper");

const config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET_NAME,
};

const zipper = new S3Zipper(config);

export {};

function checkIfUrlExpired(generationDate, expiryTime) {
  let generationTime = new Date(generationDate);

  generationTime.setSeconds(generationTime.getSeconds() + expiryTime);

  let currentTime = new Date();

  if (currentTime > generationTime) {
    return true;
  }

  return false;
}

async function generateFolderShareableLink(ownerID, folderID) {
  const s3 = new AWS.S3();

  let parentFolderString = `${ownerID}/${new Date().toISOString()}`;

  const result = await Files.findById(folderID);

  let folderString = result.name + "/";

  let directoryStructure = [];
  await traverseDirectory(folderID, folderString, directoryStructure);

  for (let i = 0; i < directoryStructure.length; i++) {
    const { name: fileName, _id: fileKey, folderPath } = directoryStructure[i];

    console.log({
      id: fileKey,
      folderPath: folderPath + fileName,
    });

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      CopySource: process.env.S3_BUCKET_NAME + "/" + ownerID + "/" + fileKey,
      Key: parentFolderString + "/" + folderPath + fileName,
    };

    await s3
      .copyObject(params, function (copyErr, copyData) {
        if (copyErr) {
          return Promise.reject(copyErr);
        } else {
          console.log("Copied: ", params.Key);
        }
      })
      .promise();
  }

  return Promise.resolve(parentFolderString);
}

shareableLink.get(
  "/",
  currentUserMiddleware.currentUser,
  async (req, res, next) => {
    //Get folderName from middleware
    const ownerID = req.currentUser.id;
    const s3 = new AWS.S3();
    console.log(ownerID);
    const { id: fileID } = req.query;

    let {
      name: fileName,
      share: shareableObj,
      directory: isDirectory,
    } = await Files.findById(fileID);
    let expiryTime = 360;

    let urlExpired =
      shareableObj?.url &&
      checkIfUrlExpired(shareableObj?.generatedAt, shareableObj?.expiryTime);

    if (!urlExpired && shareableObj?.url) {
      return res.status(200).send({ url: shareableObj?.url });
    } else {
      if (isDirectory) {
        const parentFolderString = await generateFolderShareableLink(
          ownerID,
          fileID
        );

        console.log(parentFolderString);

        const s3FileName = "folders.zip";

        return zipper.zipToS3File(
          {
            s3FolderName: parentFolderString,
            startKey: null, // optional
            s3ZipFileName: s3FileName,
            recursive: true,
            tmpDir: null, // optional, defaults to node_modules/aws-s3-zipper
          },
          async function (err, result) {
            if (err) return Promise.reject(err);
            else {
              var lastFile = result.zippedFiles[result.zippedFiles.length - 1];
              if (lastFile) console.log("last key ", lastFile.Key); // next time start from here

              const downloadFolderParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: parentFolderString + "/" + s3FileName,
                Expires: 60,
              };

              //Get presigned url
              const url = s3.getSignedUrl("getObject", downloadFolderParams);
              console.log(url);

              await Files.findByIdAndUpdate(fileID, {
                share: {
                  url,
                  expiryTime,
                  generatedAt: new Date(),
                },
              });

              res.status(200).send({ url });
            }
          }
        );

        // .catch((error) => res.status(500).send({ error }));
      } else {
        try {
          const downloadFolderParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: ownerID + "/" + fileID,
            Expires: expiryTime,
            ResponseContentDisposition: `attachment; filename = ${fileName}`,
          };

          //Get presigned url
          const url = s3.getSignedUrl("getObject", downloadFolderParams);

          await Files.findByIdAndUpdate(fileID, {
            share: {
              url,
              expiryTime,
              generatedAt: new Date(),
            },
          });

          res.status(200).send({ url });
        } catch (error) {
          console.log(error);
          res.status(500).send({ error });
        }
      }
    }
  }
);

module.exports = shareableLink;
