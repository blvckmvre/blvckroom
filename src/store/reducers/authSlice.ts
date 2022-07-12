import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthResponse } from "../../types/auth-types";
import { authLogoutAction, authMutationAction, isAuthorized } from "../actionCreators/authActionCreators";

interface IAuthState {
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    responseData: IAuthResponse | null;
}

const initialState: IAuthState = {
    isLoggedIn: false,
    isLoading: false,
    error: null,
    responseData: null
}

export const authSlice = createSlice({
    initialState,
    name: "authentication",
    reducers: {},
    extraReducers: {
        [authMutationAction.pending.type]: (state) => {
            state.isLoading = true;
        },
        [authMutationAction.fulfilled.type]: (state,action: PayloadAction<IAuthResponse>)  => {
            state.responseData = action.payload;
            state.isLoading = false;
            state.error = null;
            state.isLoggedIn = true;
        },
        [authMutationAction.rejected.type]: (state,action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [authLogoutAction.pending.type]: (state) => {
            state.isLoading = true;
        },
        [authLogoutAction.fulfilled.type]: (state,action: PayloadAction<IAuthResponse>)  => {
            state.responseData = action.payload;
            state.isLoading = false;
            state.error = null;
            state.isLoggedIn = false;
        },
        [authLogoutAction.rejected.type]: (state,action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [isAuthorized.pending.type]: (state) => {
            state.isLoading = true;
        },
        [isAuthorized.fulfilled.type]: (state,action: PayloadAction<IAuthResponse>) => {
            state.responseData = action.payload;
            state.isLoading = false;
            state.error = null;
            state.isLoggedIn = true;
        },
        [isAuthorized.rejected.type]: (state,action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
})