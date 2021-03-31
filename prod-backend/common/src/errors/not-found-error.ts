import {CustomErrorModel} from "./custom-error.model";

export class NotFoundError extends CustomErrorModel {
    statusCode = 404;

    constructor(private msg: string) {
        super(msg);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{
            message: this.msg
        }];
    }
}
