import {File} from '../models/file.model';
import {StorageFactory} from "../storage/Storage.factory";
import {StorageTypes} from "../storage/Storage.model";

export const deleteDirectory = async (folderId: string, ownerId: string) => {
    const storage = StorageFactory.getStorage(StorageTypes.S3);
    const deletedFolder = await File.findByIdAndDelete(folderId);
    if (!deletedFolder) {
        return;
    }
    const children = await File.find({
        parentId: deletedFolder._id
    });

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.isDirectory) {
            await deleteDirectory(child._id.toHexString(), ownerId);
        } else {
            await File.findByIdAndDelete(child._id);
            storage.deleteFile(child._id.toHexString(), ownerId);
        }
    }
};
