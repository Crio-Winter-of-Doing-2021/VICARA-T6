import {NextFunction, Response} from "express";
import {File, FileDoc} from '../models/file.model';
import {traverseDirectory} from "./traverseDirectoryHelper";
import {StorageFactory} from "../storage/Storage.factory";
import {StorageTypes} from '../storage/Storage.model';

interface DirectoryStructure extends FileDoc {
    folderPath: string;
}

const createMiddleware = {
    directory: async function (req: any, res: Response, next: NextFunction) {
        const ownerId = req.currentUser!.id;

        let { folder: folderIDs } = req.body;

        console.log({ folderIDs });
        const s3 = StorageFactory.getStorage(StorageTypes.S3);

        let parentFolderString = `${ownerId}/${new Date().toISOString()}`;

        for (let i = 0; i < folderIDs.length; i++) {
            const result = await File.findById(folderIDs[i]);

            if (!result) {
                console.log(`${folderIDs[i]}: error id not found`);
                return res.status(500).send({err: 'A file was not found'});
            }

            if (result!.isDirectory) {
                let folderString = result!.fileName + "/";

                const directoryStructure: DirectoryStructure[] = [];
                await traverseDirectory(folderIDs[i], folderString, directoryStructure);
                console.log('DIR_STRUCTURE');
                console.log({directoryStructure});

                for (let i = 0; i < directoryStructure.length; i++) {
                    const {
                        fileName,
                        _id: fileKey,
                        folderPath,
                    } = directoryStructure[i];

                    console.log({
                        id: fileKey,
                        folderPath: folderPath + fileName,
                    });

                    // const params = {
                    //     Bucket: process.env.S3_BUCKET_NAME,
                    //     CopySource:
                    //         process.env.S3_BUCKET_NAME + "/" + ownerId + "/" + fileKey,
                    //     Key: parentFolderString + "/" + folderPath + fileName,
                    // };
                    const src = process.env.AWS_BUCKET_NAME + "/" + ownerId + "/" + fileKey;
                    const dest = parentFolderString + "/" + folderPath + fileName;
                    await s3.copyFile(src, dest, ownerId);
                }
            } else {
                // const params = {
                //     Bucket: process.env.S3_BUCKET_NAME,
                //     CopySource:
                //         process.env.S3_BUCKET_NAME + "/" + ownerId + "/" + result._id,
                //     Key: parentFolderString + "/" + result.name,
                // };

                const src = process.env.AWS_BUCKET_NAME + "/" + ownerId + "/" + result!._id;
                const dest = parentFolderString + "/" + result!.fileName;
                await s3.copyFile(src, dest, ownerId);
            }
        }

        req.folderName = parentFolderString;
        next();
    },
};

export {createMiddleware};
