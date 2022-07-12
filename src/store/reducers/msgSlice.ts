import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../types/message-types";

interface IMessageState {
    messages: IMessage[];
    chatMessage: string;
    usersTyping: string[];
}
const initialState: IMessageState = {
    messages: [],
    chatMessage: "",
    usersTyping: []
}

export const msgSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state,action: PayloadAction<IMessage>) => {
            state.messages.push(action.payload);
        },
        setChatMessage: (state,action: PayloadAction<string>) => {
            state.chatMessage = action.payload;
        },
        setUsersTyping: (state,action: PayloadAction<string[]>) => {
            state.usersTyping = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        }
    }
})