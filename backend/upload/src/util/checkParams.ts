import validator from "validator";

import { File } from '../models/file.model';
import { FileUploadRequest, StorageTypes } from '../storage/Storage.model';
import { StorageFactory } from "../storage/Storage.factory";

export const isFilenameValid =(() => {
    const RG1=/^[^\\/:\*\?"<>\|]+$/;    // forbidden characters \ / : * ? " < > |
    const RG2=/^\./;    // cannot start with dot (.)
    const RG3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i;    // forbidden file names
    return (fileName: string) => RG1.test(fileName)&&!RG2.test(fileName)&&!RG3.test(fileName);
})();

export const checkFileUploadParams =
    async (fileProps: FileUploadRequest, clientId: string, overwrite: boolean):
        Promise<{message: string, field: string}[]> => {

    const res: {message: string, field: string}[] = [];
    if (!fileProps.fileName || !isFilenameValid(fileProps.fileName)) {
        res.push({
            field: 'fileName',
            message: 'a valid filename property should be provided'
        });
        return res;
    }
    if (!fileProps.parentId || !validator.isMongoId(fileProps.parentId)) {
        res.push({
            field: 'parentId',
            message: 'Invalid parentId provided'
        });
        return res;
    }
    const parentDir = await File.findOne({
        _id: fileProps.parentId,
        isDirectory: true,
        ownerId: clientId
    });
    if (!parentDir) {
        res.push({
            field: 'parentId',
            message: 'Invalid parentId provided'
        });
        return res;
    }
    const duplicateFile = await File.findOne({
        fileName: fileProps.fileName,
        parentId: fileProps.parentId
    });

    if (duplicateFile) {
        if (overwrite) {
            const storage = StorageFactory.getStorage(StorageTypes.S3);
            await storage.deleteFile(duplicateFile._id.toHexString());
            await File.findByIdAndDelete(duplicateFile._id);
        } else {
            res.push({
                field: 'fileName',
                message: 'a duplicate file exists in this directory'
            });
            return res;
        }
    }
    return res;
};
