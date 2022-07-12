import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./reducers/authSlice";
import { chatSlice } from "./reducers/chatSlice";
import { msgSlice } from "./reducers/msgSlice";
import { userSlice } from "./reducers/userSlice";

const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [msgSlice.name]: msgSlice.reducer,
    [chatSlice.name]: chatSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer
})


export type RootState = ReturnType<typeof rootReducer>;
export type DispatchType = typeof store["dispatch"];