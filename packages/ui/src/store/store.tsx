import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./reducers/LoginReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import operationsReducer from "./reducers/OperationsReducer";
import investmentReducer from "./reducers/InvestmentsReducer";
import accountReducer from "./reducers/AccountReducer";

const store = configureStore({
    reducer: {
        loginSlice: userReducer, 
        operationSlice: operationsReducer,
        invesmentsSlice: investmentReducer,
        accountSlice: accountReducer 
    },
    
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;