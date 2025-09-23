import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./reducers/LoginReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        loginSlice: userReducer,        
    },
    
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;