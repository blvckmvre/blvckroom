import * as bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import db from "./dbService";
require("dotenv").config();


class TokenService {
    async hashPassword(password: string) {
        const hashed = await bcrypt.hash(password, 12);
        return hashed;
    }
    async compareHash(input: string, stored: string) {
        const isValid = await bcrypt.compare(input, stored);
        return isValid;
    }
    signToken(id: number, username: string) {
        const accessToken = sign({
            id, username
        }, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: "30m"
        });
        const refreshToken = sign({
            id, username
        }, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: "12h"
        });
        return {accessToken, refreshToken};
    }
    async saveToken(userID: number, token: string){
        const matchedTokens = await db.findTokenMatch(userID);
        if(matchedTokens.length)
            await db.updateToken(userID,token); 
        else 
            await db.addToken(userID,token);
    }
    verifyToken(token: string, type: "access" | "refresh") {
        const isValid = verify(
            token, 
            type === "access" ? 
                process.env.JWT_ACCESS_SECRET! : 
                process.env.JWT_REFRESH_SECRET!
            );
        return isValid;
    }
}

export default new TokenService();