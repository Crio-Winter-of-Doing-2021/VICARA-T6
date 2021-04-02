import { StorageModel, StorageTypes } from './Storage.model';
import { S3Storage } from "./S3Storage";

export class StorageFactory {
    static getStorage(type: StorageTypes): StorageModel {
        switch (type) {
            case StorageTypes.S3: return S3Storage.getInstance();
        }
    }
}