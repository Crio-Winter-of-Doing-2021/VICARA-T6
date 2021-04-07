export abstract class StorageModel {
    abstract downloadFile(key: string, ownerId: string, fileName: string): Promise<any>;
    abstract copyFile(key: string, newName: string, ownerId: string): Promise<any>;
    abstract getFileUrl(key: string, expireTime: number, downloadFileName: string): string;
}

export interface FileUploadRequest {
    fileName: string;
    parentId: string;
}

export interface SaveFileFailed extends FileUploadRequest {
    errCode: number;
    errors: {message: string}[];
}

export interface DeleteFileFailed {
    fileId: string;
    errCode: number;
    errors: {message: string; field?: string}[];
}

export enum StorageTypes {
    S3
}
