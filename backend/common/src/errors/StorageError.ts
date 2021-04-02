import { CustomErrorModel } from "./custom-error.model";

export class StorageError extends CustomErrorModel {
    statusCode = 500;

    constructor(public msg: string) {
        super(msg);
        Object.setPrototypeOf(this, StorageError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{
            message: this.msg,
        }];
    }
}