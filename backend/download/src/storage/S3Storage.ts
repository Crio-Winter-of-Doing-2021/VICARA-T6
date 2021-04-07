import AWS from 'aws-sdk';

import { StorageModel } from "./Storage.model";

interface S3uploadParams {
    Bucket: string;
    Key: string;
    Body: NodeJS.ReadableStream;
}

export class S3Storage extends StorageModel {
    private readonly bucketName: string;
    private client: AWS.S3;
    private static instance: S3Storage;

    private constructor() {
        super();
        // Checking if correct environment variables are set for S3
        if (
            !process.env.AWS_ACCESS_KEY_ID ||
            !process.env.AWS_SECRET_ACCESS_KEY ||
            !process.env.AWS_BUCKET_NAME
        ) {
            throw new Error('AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_BUCKET_NAME' +
                'should be set in environment variables for S3');
        }

        // Populate instance properties
        this.client = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        this.bucketName = process.env.AWS_BUCKET_NAME;
    }

    static getInstance(): S3Storage {
        if (!S3Storage.instance) {
            S3Storage.instance = new S3Storage();
        }
        return S3Storage.instance;
    }

    public downloadFile(key: string, ownerId: string, fileName: string) {
        const fetchFileParams = {
            Bucket: this.bucketName,
            Key: `${ownerId}/${key}`,
            ResponseContentDisposition: `attachment; filename ="${fileName}"`,
        };
        return this.client.getObject(fetchFileParams).promise();
    }

    public copyFile(key: string, newName: string, ownerId: string) {
        const copyParams = {
            Bucket: this.bucketName,
            CopySource: `${this.bucketName}/${ownerId}/${key}`,
            Key: `${ownerId}/${newName}`
        };
        return this.client.copyObject(copyParams).promise();
    }

    public getFileUrl(key: string, expireTime: number, downloadFileName: string) {
        const downloadFileParams = {
            Bucket: this.bucketName,
            Key: key,
            Expires: expireTime,
            ResponseContentDisposition: `attachment; filename = ${downloadFileName}`,
        };
        return this.client.getSignedUrl("getObject", downloadFileParams);
    }

}