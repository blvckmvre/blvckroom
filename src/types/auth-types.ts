import { ErrorsType } from "./error-types";

export enum AuthOperations {
    signup = 'signup',
    login = 'login',
    logout = 'logout',
    refresh = 'refresh'
}

type AuthOperationType = 
    AuthOperations.signup |
    AuthOperations.login  |
    AuthOperations.logout |
    AuthOperations.refresh;

export type AuthMutationType = AuthOperations.login | AuthOperations.signup;

interface IUserResponse {
    id: number;
    username: string;
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse {
    result: "success";
    operation: AuthOperationType;
    user?: IUserResponse;
}

export interface IAuthError {
    status: number;
    message: string;
    errors: ErrorsType; 
}

export interface IAuthBody {
    username: string;
    password: string;
    operation: AuthMutationType;
}

