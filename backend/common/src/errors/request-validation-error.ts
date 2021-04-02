import {ValidationError} from "express-validator";

import {CustomErrorModel} from "./custom-error.model";

export class RequestValidationError extends CustomErrorModel {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request received');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(error => {
            return {message: error.msg, field: error.param};
        });
    }
}