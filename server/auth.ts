import { JwtPayload, verify } from "jsonwebtoken";
import { Response, NextFunction, Request } from "express";
import { AppError } from "./errors/errorHandler";
import tokenService from "./services/tokenService";

interface CustomHeaders {
    authorization: string | undefined;
}

interface CustomRequest {
    headers: CustomHeaders;
    user?: string | JwtPayload | null;
}

module.exports = (q: CustomRequest, a: Response, next: NextFunction) => {
    try{
        const token = q.headers.authorization ? 
            q.headers.authorization.split(' ')[1] : 
            null;
        if(!token) 
            return next(AppError.Unauthorized());
        const isValid = tokenService.verifyToken(token, "access");
        if(isValid){
            q.user = isValid;
            next();
        }
        else return next(AppError.Unauthorized());
    }
    catch(e) {
        return next(AppError.Unauthorized());
    }
        
}
