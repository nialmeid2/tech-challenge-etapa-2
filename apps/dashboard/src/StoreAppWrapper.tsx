"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import { User } from "@repo/ui/model/User";
import { Transaction } from "@repo/ui/model/Transaction";
import Dashboard from "@repo/ui/components/Dashboard/index";
import OperationsPage from "./OperationsPage";
export default function StoreAppWrapper({ createAdditiveOperation, createSubtractiveOperation, clearLoggedUser, loadPageInfo }: {
    createAdditiveOperation: (user: User, transaction: Omit<Transaction, "id">) => Promise<void>,
    createSubtractiveOperation: (user: User, transaction: Omit<Transaction, "id">) => Promise<void>,
    clearLoggedUser: () => Promise<void>,
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
            <OperationsPage createAdditiveOperation={createAdditiveOperation} createSubtractiveOperation={createSubtractiveOperation} loadPageInfo={loadPageInfo} />
        </Dashboard> 
    </Provider>
}