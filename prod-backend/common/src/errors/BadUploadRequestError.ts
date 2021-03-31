import { CustomErrorModel } from "./custom-error.model";

export class BadUploadRequestError extends CustomErrorModel {
    statusCode = 400;

    constructor(private fieldErrors: { message: string; field?: string }[]) {
        super('Bad file upload request');
        Object.setPrototypeOf(this, BadUploadRequestError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return this.fieldErrors;
    }
}