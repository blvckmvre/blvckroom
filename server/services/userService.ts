import { AppError } from "../errors/errorHandler";
import db from "./dbService";
import tokenService from "./tokenService";

class UserService {
    async signupOperation(username: string, password: string) {
        const rows = await db.findUserMatch(username);
        if(rows.length)
            throw AppError.BadRequest("USER ALREADY EXISTS");
        const hashed = await tokenService.hashPassword(password);
        const id = await db.addUser(username,hashed);
        const {accessToken, refreshToken} = tokenService.signToken(id,username);
        await tokenService.saveToken(id, refreshToken);
        return {
            accessToken,
            refreshToken,
            id,
            username
        }
    }
    async loginOperation(username: string, password: string) {
        const rows = await db.findUserMatch(username);
        if(rows.length){
            const {id, password: storedPassword} = rows[0];
            const isValid = await tokenService.compareHash(password,storedPassword);
            if(isValid){
                const {accessToken, refreshToken} = tokenService.signToken(id,username);
                await tokenService.saveToken(id, refreshToken);
                return {
                    accessToken,
                    refreshToken,
                    id,
                    username
                }
            } else throw AppError.BadRequest("INVALID PASSWORD");
        } else throw AppError.BadRequest("USER WAS NOT FOUND");

    }
    async logoutOperation(token: string) {
        if(token)
            await db.rmToken(token);
        else 
            throw AppError.Unauthorized();
    }
    async refreshOperation(token: string) {
        if(token) {
            const isValid = tokenService.verifyToken(token, "refresh");
            const foundRows = await db.findToken(token);
            if(isValid && foundRows.length){
                const user = await db.findUserById(foundRows[0].userid);
                const {accessToken, refreshToken} = tokenService.signToken(user.id, user.username);
                await tokenService.saveToken(user.id, refreshToken);
                return {
                    accessToken,
                    refreshToken,
                    id: user.id,
                    username: user.username
                }
            } else throw AppError.Unauthorized();
        } else throw AppError.Unauthorized();
    }
}

export default new UserService();