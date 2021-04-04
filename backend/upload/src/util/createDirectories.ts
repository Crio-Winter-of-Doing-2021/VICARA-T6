import {File} from '../models/file.model';
import {isFilenameValid} from './checkParams';
import validator from "validator";

interface Dictionary<T = any> {
    [key: string]: T;
}

export const createDirectories =
    async (ownerId: string, parentId: string, paths: string[]): Promise<Object> => {
    const mapPathToId = new Map<string, string>();
    mapPathToId.set('', parentId);

    for (let j = 0; j < paths.length; j++) {
        const path = paths[j];
        const folders = path.split('/');
        for (let i = 0; i < folders.length; i++) {
            const fullPath = folders.slice(0, i+1).join('/');
            if (mapPathToId.has(fullPath)) {
                continue;
            }
            const currentParent = mapPathToId.get(folders.slice(0, i).join('/'));
            const newFolder = File.buildDir({
                fileName: folders[i],
                parentId: currentParent!,
                ownerId,
                isDirectory: true
            });
            await newFolder.save();
            mapPathToId.set(fullPath, newFolder._id.toHexString());
        }
    }

    const obj: Dictionary<string> = {};

    mapPathToId.forEach(((value, key) => {
        obj[key] = value;
    }));
    return obj;
};

export const checkFolderUploadParams =
    async (parentId: string, ownerId: string, paths: string[]):
        Promise<{ message: string, field: string }[]> => {
        const res: {message: string, field: string}[] = [];
        if (!parentId || !validator.isMongoId(parentId)) {
            res.push({
                field: 'parentId',
                message: 'Invalid parentId provided'
            });
            return res;
        }
        const parentDir = await File.findOne({
            _id: parentId,
            isDirectory: true,
            ownerId
        });
        if (!parentDir) {
            res.push({
                field: 'parentId',
                message: 'Invalid parentId provided'
            });
            return res;
        }
        paths = paths.map(path => {
            const folders = path.split('/');
            return folders.map(folder => folder.trim()).join('/');
        });
        paths.forEach(path => {
            const invalidNames = path.split('/').filter(dirName => !isFilenameValid(dirName));
            if (invalidNames.length > 0) {
                res.push({
                    field: 'paths',
                    message: `invalid folder names: ${invalidNames.join(', ')}`
                });
            }
        });
        return res;
};
