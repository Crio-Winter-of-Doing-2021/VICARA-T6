import {CustomErrorModel} from "./custom-error.model";

export class NotAuthorizedError extends CustomErrorModel {
    statusCode = 401;

    constructor() {
        super('Not authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{message: 'Not authorized'}];
    }
}