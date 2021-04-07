import express, {Response} from "express";

import {createMiddleware} from "../util/directoryMiddleware";
import {StorageFactory} from "../storage/Storage.factory";
import {StorageTypes} from '../storage/Storage.model';

const S3Zipper = require("../util/aws_s3_zipper");

const router = express.Router();

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1',
    bucket: process.env.AWS_BUCKET_NAME,
};

const zipper = new S3Zipper(config);

router.post(
    "/api/downloads/folder",
    createMiddleware.directory,
    async (req: any, res: Response) => {
        //Get folderName from middleware
        const ownerId = req.currentUser!.id;
        const s3FileName = "folders.zip";
        const s3 = StorageFactory.getStorage(StorageTypes.S3);
        const { folderName } = req;

        console.log(`FOLDER_NAME:::: ${folderName}`);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            res.set("content-type", "application/zip"); // optional

            zipper.zipToS3File(
                {
                    s3FolderName: folderName,
                    startKey: null, // optional
                    s3ZipFileName: s3FileName,
                    recursive: true,
                    tmpDir: null, // optional, defaults to node_modules/aws-s3-zipper
                },
                function (err: any, result: any) {
                    if (err) console.error(err);
                    else {
                        var lastFile = result.zippedFiles[result.zippedFiles.length - 1];
                        if (lastFile) console.log("last key ", lastFile.Key); // next time start from here

                        // const downloadFolderParams = {
                        //     Bucket: process.env.S3_BUCKET_NAME,
                        //     Key: folderName + "/" + s3FileName,
                        //     Expires: 60,
                        // };

                        //Get presigned url
                        const key = folderName + "/" + s3FileName;
                        const url = s3.getFileUrl(key, 60, s3FileName, ownerId);

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

export {router as downloadFolderRouter};
