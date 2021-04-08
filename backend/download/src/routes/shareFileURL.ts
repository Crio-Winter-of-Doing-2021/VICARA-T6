import express, {Request, Response} from "express";
import {File} from '../models/file.model';
import {traverseDirectory} from "../util/traverseDirectoryHelper";
import {StorageFactory} from "../storage/Storage.factory";
import {StorageTypes} from '../storage/Storage.model';

const S3Zipper = require("../util/aws_s3_zipper");

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1',
    bucket: process.env.AWS_BUCKET_NAME,
};

const router = express.Router();

const zipper = new S3Zipper(config);

const s3 = StorageFactory.getStorage(StorageTypes.S3);

function checkIfUrlExpired(generationDate: Date, expiryTime: number) {
    const generationTime = new Date(generationDate);

    generationTime.setSeconds(generationTime.getSeconds() + expiryTime);

    const currentTime = new Date();

    return currentTime > generationTime;
}

async function generateFolderShareableLink(ownerId: string, folderId: string) {
    let parentFolderString = `${new Date().toISOString()}`;

    const result = await File.findById(folderId);

    let folderString = result!.fileName + "/";

    const directoryStructure: any[] = [];
    await traverseDirectory(folderId, folderString, directoryStructure);

    for (let i = 0; i < directoryStructure.length; i++) {
        const { fileName, _id: fileKey, folderPath } = directoryStructure[i];

        console.log({
            id: fileKey,
            folderPath: folderPath + fileName,
        });

        const src = fileKey;
        const dest = parentFolderString + "/" + folderPath + fileName;
        await s3.copyFile(src, dest, ownerId);
    }

    return Promise.resolve(parentFolderString);
}

router.get("/api/downloads/shareurl/:id",
    async (req: Request, res: Response) => {
        //Get folderName from middleware
        const ownerId = req.currentUser!.id;
        const fileId = req.params.id;

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).send({err: 'File not found'});
        }
        const {fileName, share, isDirectory} = file;
        const expiryTime = 360;

        let urlExpired =
            share?.url &&
            checkIfUrlExpired(share?.generatedAt, share?.expiryTime);

        if (!urlExpired && share?.url) {
            return res.status(200).send({ url: share?.url });
        } else {
            if (isDirectory) {
                const parentFolderString = await generateFolderShareableLink(
                    ownerId,
                    fileId
                );

                console.log(parentFolderString);

                const s3FileName = "folders.zip";

                return zipper.zipToS3File(
                    {
                        s3FolderName: `${ownerId}/${parentFolderString}`,
                        startKey: null, // optional
                        s3ZipFileName: s3FileName,
                        recursive: true,
                        tmpDir: null, // optional, defaults to node_modules/aws-s3-zipper
                    },
                    async function (err: any, result: any) {
                        if (err) return Promise.reject(err);
                        else {
                            var lastFile = result.zippedFiles[result.zippedFiles.length - 1];
                            if (lastFile) console.log("last key ", lastFile.Key); // next time start from here

                            //Get presigned url

                            const key = parentFolderString + "/" + s3FileName;
                            const url = s3.getFileUrl(
                                key,
                                expiryTime,
                                s3FileName,
                                ownerId
                                );
                            console.log(url);

                            await File.findByIdAndUpdate(fileId, {
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
                    const key = fileId;

                    //Get presigned url
                    const url = s3.getFileUrl(
                        key,
                        expiryTime,
                        fileName,
                        ownerId
                        );

                    await File.findByIdAndUpdate(fileId, {
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

export {router as shareFileRouter};
