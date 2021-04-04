import validator from "validator";

import {File} from '../models/file.model';
import {getAncestors} from "./getParents";

export const isFilenameValid =(() => {
    const RG1=/^[^\\/:\*\?"<>\|]+$/;    // forbidden characters \ / : * ? " < > |
    const RG2=/^\./;    // cannot start with dot (.)
    const RG3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i;    // forbidden file names
    return (fileName: string) => RG1.test(fileName)&&!RG2.test(fileName)&&!RG3.test(fileName);
})();

interface errResponse {
    field: string;
    message: string;
}

export const checkUpdateIdParam =
    async (ownerId: string, id: string):
        Promise<errResponse[]> => {
    const res: errResponse[] = [];
    if (!id || !validator.isMongoId(id)) {
        res.push({
            field: 'id',
           message: 'not a valid file id'
        });
        return res;
    }
    const reqFile = await File.findOne({
        _id: id,
        ownerId
    });
    if (!reqFile) {
        res.push({
            field: 'id',
            message: 'not a valid file id'
        });
        return res;
    }
    return res;
}

export const checkParentParam =
    async (newParent: string, ownerId: string, toMoveId: string): Promise<errResponse[]> => {
    const res: errResponse[] = [];
    if (!newParent || !validator.isMongoId(newParent)) {
        res.push({
            field: 'newParent',
            message: 'not a valid file id'
        });
        return res;
    }
    const reqParent = await File.findOne({
        _id: newParent,
        ownerId,
        isDirectory: true
    });
    if (!reqParent) {
        res.push({
            field: 'newParent',
            message: 'not a valid directory id'
        });
        return res;
    }
    const newParentAncestors = await getAncestors(ownerId, newParent);
    const isSubDir = newParentAncestors.filter(ancestor => ancestor._id.toHexString() === toMoveId);
    if (isSubDir.length !== 0) {
        res.push({
            field: 'newParent',
            message: 'Cannot move to a subdirectory'
        });
        return res;
    }
    return res;
};

export const checkFileNameParam =
    async (newFileName: string, ownerId: string, newParent: string):
        Promise<errResponse[]> => {
    const res: errResponse[] = [];
    if (!newFileName || !isFilenameValid(newFileName)) {
        res.push({
            field: 'newFileName',
            message: 'not a valid filename'
        });
        return res;
    }

    const dupFile = await File.findOne({
        fileName: newFileName,
        ownerId,
        parentId: newParent
    });

    if (dupFile) {
        res.push({
            field: 'newFileName',
            message: 'a file with duplicate name already exists'
        });
        return res;
    }
    return res;
}