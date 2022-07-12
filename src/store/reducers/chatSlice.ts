import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoom } from "../../types/room-types";
import { createRoom, deleteRoom, getRooms } from "../actionCreators/chatActionCreators";

interface IChatState {
    isLoading: boolean;
    error: string | null;
    rooms: IRoom[];
    roomTitle: string;
}

const initialState: IChatState = {
    isLoading: false,
    error: null,
    rooms: [],
    roomTitle: ""
}

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setRoomTitle: (state,action: PayloadAction<string>) => {
            state.roomTitle = action.payload;
        }
    },
    extraReducers: {
        [getRooms.pending.type]: (state)=>{
            state.isLoading = true;
        },
        [getRooms.fulfilled.type]: (state, action: PayloadAction<IRoom[]>) => {
            state.rooms = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        [getRooms.rejected.type]: (state,action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        [createRoom.pending.type]: (state)=>{
            state.isLoading = true;
        },
        [createRoom.fulfilled.type]: (state,action: PayloadAction<IRoom[]>) => {
            state.rooms = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        [createRoom.rejected.type]: (state,action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        [deleteRoom.pending.type]: (state)=>{
            state.isLoading = true;
        },
        [deleteRoom.fulfilled.type]: (state,action: PayloadAction<IRoom[]>) => {
            state.rooms = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        [deleteRoom.rejected.type]: (state,action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    }
})