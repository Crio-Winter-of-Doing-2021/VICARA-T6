import {File, FileDoc} from '../models/file.model';

export const getAncestors =
    async (ownerId: string, fileId: string): Promise<FileDoc[]> => {
    const ancestors: FileDoc[] = [];

    let curFile = await File.findById(fileId);

    while (true) {
        if (curFile!.parentId === ownerId && curFile!.ownerId === ownerId) {
            ancestors.push(curFile!);
            return ancestors;
        }
        ancestors.push(curFile!);
        curFile  = await File.findById(curFile!.parentId);
    }
};
