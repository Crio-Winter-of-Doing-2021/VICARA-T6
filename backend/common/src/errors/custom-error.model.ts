export abstract class CustomErrorModel extends Error {
    abstract statusCode: number;

    protected constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomErrorModel.prototype);
    }

    abstract serializeErrors(): {message: string; field?: string}[];
}