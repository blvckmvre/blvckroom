import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
    username: string;
    password: string;
}

const initialState: IUserState = {
    username: "",
    password: ""
};

export const userSlice = createSlice({
    name: "users",
    initialState,
    reducers:{
        setUsername: (state,action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setPassword: (state,action: PayloadAction<string>) => {
            state.password = action.payload
        }
    }
})