import { createAsyncThunk } from "@reduxjs/toolkit";
import { $req } from "../../axios/config";

interface MkRoomParams {
    name: string;
    creator: string;
}

interface RmRoomParams {
    id: number;
    creator: string;
}

export const getRooms = createAsyncThunk("rooms/get", async(_, thunkAPI)=>{
    try {
        const res = await $req.get("/rooms");
        return res.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data.message);
    }
})

export const createRoom = createAsyncThunk("room/mk", async(params: MkRoomParams, thunkAPI)=>{
    try {
        const res = await $req.post("/mkroom", params);
        return res.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data.message);
    }
})

export const deleteRoom = createAsyncThunk("room/rm", async(params: RmRoomParams, thunkAPI)=>{
    try {
        const res = await $req.post("/rmroom", params);
        return res.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data.message);
    }
})