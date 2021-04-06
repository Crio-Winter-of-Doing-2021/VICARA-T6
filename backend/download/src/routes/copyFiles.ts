import express from "express";

import {File, FileDoc} from '../models/file.model';
import {traverseDirectory} from "../util/traverseDirectoryHelper";
import {StorageFactory} from "../storage/Storage.factory";
import {StorageTypes} from '../storage/Storage.model';

const router = express.Router();

const s3 = StorageFactory.getStorage(StorageTypes.S3);

async function copyFolderUtility(
    parent_id: string,
    ownerId: string,
    folder_id: string
): Promise<void> {
    const result = await File.findById(folder_id);
    let folderString = result!.fileName + "/";
    //Add the initial folder id to the arr
    let directoryStructure = [
        {
            folderPath: folderString,
            ...JSON.parse(JSON.stringify(result)),
        },
    ];
    let directoryMapper = {} as any;
    //Traverse the children and get their IDs
    await traverseDirectory(folder_id, folderString, directoryStructure, true);

    //Root folder
    let tempExisting = directoryStructure[0] as FileDoc;
    const fileID = tempExisting._id;
    tempExisting = JSON.parse(JSON.stringify(tempExisting));
    //Delete unecessary data
    delete tempExisting._id;
    delete tempExisting.updatedAt;
    delete tempExisting.createdAt;
    tempExisting.parentId = parent_id;
    const new_file = new File(tempExisting);
    await new_file.save();
    // console.log("Duplicate File Created in DB");
    directoryMapper[fileID] = new_file._id;

    //Inner folders
    for (let i = 1; i < directoryStructure.length; i++) {
        let tempExisting = directoryStructure[i] as FileDoc;
        const fileID = tempExisting._id;
        tempExisting = JSON.parse(JSON.stringify(tempExisting));
        //Delete unecessary data
        delete tempExisting._id;
        delete tempExisting.updatedAt;
        delete tempExisting.createdAt;

        if (directoryMapper[tempExisting.parentId] !== undefined) {
            console.log("EXISTS : ", tempExisting.fileName, fileID, tempExisting.parentId);
            tempExisting.parentId = directoryMapper[tempExisting.parentId];
        } else {
            console.log(
                "DOES NOT EXISTS : ",
                tempExisting.fileName,
                fileID,
                tempExisting.parentId
            );
            tempExisting.parentId = parent_id;
        }

        const new_file = new File(tempExisting);

        if (!new_file.isDirectory) {
            console.log(
                "Copying file with ID " + fileID + " to new ID " + new_file._id
            );
            // const params = {
            //     Bucket: process.env.S3_BUCKET_NAME,
            //     CopySource: process.env.S3_BUCKET_NAME + "/" + ownerId + "/" + fileID,
            //     Key: ownerId + "/" + new_file._id.toString(),
            // };
            //Send the delete request
            const src = process.env.AWS_BUCKET_NAME + "/" + ownerId + "/" + fileID;
            const dest = ownerId + "/" + new_file._id.toString();
            try {
                await s3.copyFile(src, dest, ownerId);
            } catch (error) {
                return Promise.reject();
            }
        }

        await new_file.save();
        console.log("Duplicate File Created in DB");
        directoryMapper[fileID] = new_file._id;
    }

    console.log(directoryMapper);

    return Promise.resolve();
}

async function copyFileUtility(
    parentId: string,
    ownerId: string,
    fileId: string
): Promise<void> {
    const existingFile = await File.findById(fileId);

    if (existingFile) {
        let tempExisting = existingFile;
        tempExisting = JSON.parse(JSON.stringify(tempExisting));
        //Delete unecessary data
        delete tempExisting._id;
        delete tempExisting.updatedAt;
        delete tempExisting.createdAt;
        tempExisting.parentId = parentId;
        const new_file = new File(tempExisting);
        await new_file.save();
        console.log("Duplicate File Created in DB");

        // const params = {
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     CopySource:
        //         process.env.S3_BUCKET_NAME + "/" + ownerId + "/" + existingFile._id,
        //     Key: ownerId + "/" + new_file._id.toString(),
        // };
        const src = process.env.S3_BUCKET_NAME + "/" + ownerId + "/" + existingFile._id;
        const dest = ownerId + "/" + new_file._id.toString();
        await s3.copyFile(src, dest, ownerId);
    } else {
        return Promise.reject();
    }

    return Promise.resolve();
}

router.post("/api/downloads/copyfiles",
    async (req, res, next) => {
        let { foldersList, parentId } = req.body;
        const ownerId = req.currentUser!.id;

        const fList = Object.entries(foldersList);
        console.log({fList, parentId});

        for (let i = 0; i < fList.length; i++) {
            const fileDetails = fList[i];
            const fileId: any = fileDetails[0];
            const data: any = fileDetails[1];

            if (data.isDirectory) {
                await copyFolderUtility(parentId, ownerId, fileId);
            } else {
                await copyFileUtility(parentId, ownerId, fileId);
            }
        }

        res.send("OK");
    }
);

export {router as copyFilesRouter};
