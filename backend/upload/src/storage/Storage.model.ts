import * as stream from "stream";

export abstract class StorageModel {
    abstract uploadFile(key: string):
        { writeStream: stream.PassThrough; promise: Promise<any> };
    abstract deleteFile(key: string): Promise<any>;
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
