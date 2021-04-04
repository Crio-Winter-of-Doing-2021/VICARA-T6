import {CustomErrorModel} from "./custom-error.model";

export class DatabaseConnectionError extends CustomErrorModel {
    reason = 'Connection to database failed'
    statusCode = 500;

    constructor() {
        super('Error connecting to database');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [
            {message: this.reason}
        ];
    }
}