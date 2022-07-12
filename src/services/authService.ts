import { AxiosResponse } from "axios";
import { $req } from "../axios/config";
import { IAuthResponse, AuthMutationType } from "../types/auth-types";

export class AuthService {
    static requestMutation (
            username: string, 
            password: string, 
            operation:AuthMutationType
        ): Promise<AxiosResponse<IAuthResponse>> {
        return $req.post<IAuthResponse>("/"+operation, {username, password});
    }
    static requestLogout(): Promise<AxiosResponse<IAuthResponse>> {
        return $req.get<IAuthResponse>("/logout");
    }
}