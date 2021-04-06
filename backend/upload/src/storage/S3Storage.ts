import AWS from 'aws-sdk';

import { StorageModel } from "./Storage.model";
import * as stream from "stream";

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

    public uploadFile(key: string, ownerId: string):
        { writeStream: stream.PassThrough; promise: Promise<AWS.S3.ManagedUpload.SendData> } {
        // Stream to write data into
        const pass = new stream.PassThrough();
        // S3 upload parameters
        const params: S3uploadParams = {
            Key: `${ownerId}/${key}`,
            Bucket: this.bucketName,
            Body: pass,
        };
        // Concurrency of 10, 5Mb buffers
        const opts = {
            queueSize: 10,
            partSize: 1024 * 1024 * 5
        };

        return {
            promise: this.client.upload(params, opts).promise(),
            writeStream: pass
        };
    }

    public deleteFile(key: string, ownerId: string): Promise<AWS.S3.DeleteObjectOutput> {
        const params = {
            Bucket: this.bucketName,
            Key: `${ownerId}/${key}`,
        };
        return this.client.deleteObject(params).promise();
    }
}