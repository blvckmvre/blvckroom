import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validator";

type ErrorsType = Error[] | ValidationError[];

export class AppError extends Error {
    status: number;
    errors: ErrorsType;
    constructor(status: number, message: string, errors: ErrorsType = []){
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static Unauthorized() {
        const e = new AppError(401, "UNAUTHORIZED");
        return e;
    }
    static BadRequest(message: string, errors: ErrorsType = []) {
        const e = new AppError(400, message, errors);
        return e;
    }
    static NotFound() {
        const e = new AppError(404, "RESOURCE CANNOT BE FOUND");
        return e;
    }
    static Forbidden() {
        const e = new AppError(403, "ACCESS DENIED");
        return e;
    }
}

const errorHandler = (e: Error, q: Request, a: Response, _: NextFunction) => {
    console.log(e);
    if(e instanceof AppError)
        return a.status(e.status).json({message: e.message, errors: e.errors});
    return a.status(500).json({message: "INTERNAL ERROR"});
}

export default errorHandler;