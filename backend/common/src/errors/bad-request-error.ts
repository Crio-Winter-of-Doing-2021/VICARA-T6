import {CustomErrorModel} from "./custom-error.model";

export class BadRequestError extends CustomErrorModel {
    statusCode = 400;

    constructor(public msg: string) {
        super(msg);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{message: this.message}];
    }
}