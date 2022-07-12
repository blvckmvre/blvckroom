import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthService } from "../../services/authService";
import { IAuthBody, IAuthResponse } from "../../types/auth-types";
import url from "../../url";

export const authMutationAction = createAsyncThunk("user/mutation", async(params: IAuthBody, thunkAPI) => {
    try {
        const {username, password, operation} = params;
        const res = await AuthService.requestMutation(username, password, operation);
        localStorage.setItem("accessToken", res.data.user!.accessToken);
        return res.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data.message);
    }
});

export const authLogoutAction = createAsyncThunk("user/logout", async(_, thunkAPI) => {
    try {
        const res = await AuthService.requestLogout();
        localStorage.removeItem("accessToken");
        return res.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data.message);
    }
});

export const isAuthorized = createAsyncThunk("user/check", async(_, thunkAPI) => {
    try {
        const res = await axios.get<IAuthResponse>(url+"api/refresh", {withCredentials: true});
        localStorage.setItem("accessToken", res.data.user!.accessToken);
        return res.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data.message);
    }
})
