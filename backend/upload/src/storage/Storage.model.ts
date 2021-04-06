import * as stream from "stream";

export abstract class StorageModel {
    abstract uploadFile(key: string):
        { writeStream: stream.PassThrough; promise: Promise<any> };
    abstract deleteFile(key: string, ownerId: string): Promise<any>;
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
    name: string;
    status: string;
    message: string;
}

export enum StorageTypes {
    S3
}
