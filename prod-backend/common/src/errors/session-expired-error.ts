import {CustomErrorModel} from "./custom-error.model";

export class SessionExpiredError extends CustomErrorModel {
    reason = 'Your session has expired, please login again'
    statusCode = 440;

    constructor() {
        super('User session expired');
        Object.setPrototypeOf(this, SessionExpiredError.prototype);
    }
    serializeErrors() {
        return [
            {message: this.reason}
        ];
    }
}