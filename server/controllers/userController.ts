import { NextFunction, Request, Response } from "express"
import { IUser } from "../../src/types/user-types"
import db from '../services/dbService';
import userService from "../services/userService";
import { validationResult } from "express-validator";
import { AppError } from "../errors/errorHandler";



class UserController {
    async initialize(){
        await db.createTables();
        console.log("tables created");
    }
    async signUserUp(q: Request<{}, {}, IUser>, a: Response, next: NextFunction){
        try {
            const errs = validationResult(q);
            if(!errs.isEmpty())
                return next(AppError.BadRequest("UNSUPPORTED INPUT LENGTH", errs.array()));
            const {
                accessToken,
                id,
                refreshToken,
                username
            } = await userService.signupOperation(q.body.username, q.body.password);
            a.cookie("refresh", refreshToken, {
                maxAge: 3*60*60*1000,
                httpOnly: true
            });
            return a.json({
                result: "success", 
                operation: "signup", 
                user: {id, username, refreshToken, accessToken}})
        } 
        catch(e) {
            next(e);
        }
        
    }
    async logUserIn(q: Request<{}, {}, IUser>, a: Response, next: NextFunction){
        try {
            const {
                accessToken,
                id,
                refreshToken,
                username
            } = await userService.loginOperation(q.body.username, q.body.password);
            a.cookie("refresh", refreshToken, {
                maxAge: 3*60*60*1000,
                httpOnly: true
            });
            return a.json({
                result: "success", 
                operation: "login", 
                user: {id, username, refreshToken, accessToken}
            });
        } 
        catch(e) {
            next(e);
        }
    }
    async logUserOut(q: Request, a: Response, next: NextFunction){
        try {
            const {refresh} = q.cookies;
            await userService.logoutOperation(refresh);
            a.clearCookie("refresh");
            return a.json({
                result: "success", 
                operation: "logout"
            });
        }
        catch(e) {
            next(e);
        }
    }
    async refresh(q: Request<{}, {}, IUser>, a: Response, next: NextFunction){
        try {
            const {refresh} = q.cookies;
            const {
                refreshToken, 
                accessToken,
                id,
                username
            } = await userService.refreshOperation(refresh);
            a.cookie("refresh", refreshToken, {
                maxAge: 3*60*60*1000,
                httpOnly: true
            });
            return a.json({
                result: "success",
                operation: "refresh",
                user: {
                    id,
                    username,
                    refreshToken,
                    accessToken
                }
            })
        }
        catch(e) {
            next(e);
        }
    }
}

export default new UserController();