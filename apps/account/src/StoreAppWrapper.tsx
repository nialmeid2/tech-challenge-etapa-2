"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import { User } from "@repo/ui/model/User";
import { Transaction } from "@repo/ui/model/Transaction";
import Dashboard from "@repo/ui/components/Dashboard/index";
import AccountPage from "./AccountPage";
import { TransactionTypes } from "@repo/ui/model/enums/Transaction";
export default function StoreAppWrapper({ clearLoggedUser, loadPageInfo, updateUserInfo }: {    
    clearLoggedUser: () => Promise<void>,   
    updateUserInfo(id: number, name: string, pass: string): Promise<void>, 
    loadPageInfo: () => Promise<{
        statement: Transaction[];
        loggedUser: {
            password: string;
            id: number;
            name: string;
            email: string;
            balance: number;
            createdAt: Date;
        };
    }>
}) {
    return <Provider store={store}>
        <Dashboard clearLoggedUser={clearLoggedUser} loadPageInfo={loadPageInfo}>
            <AccountPage loadPageInfo={loadPageInfo} updateUserInfo={updateUserInfo} />
        </Dashboard> 
    </Provider>
}