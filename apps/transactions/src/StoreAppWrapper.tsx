"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import { User } from "@repo/ui/model/User";
import { Transaction } from "@repo/ui/model/Transaction";
import Dashboard from "@repo/ui/components/Dashboard/index";
import TransactionsPage from "./TransactionsPage";
import { TransactionTypes } from "@repo/ui/model/enums/Transaction";
export default function StoreAppWrapper({ clearLoggedUser, loadPageInfo, filterTransactions, removeTransaction }: {    
    clearLoggedUser: () => Promise<void>,
    filterTransactions: (userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page: number) => Promise<Transaction[]>,
    removeTransaction: (transactionId: number) => Promise<string>,
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
            <TransactionsPage loadPageInfo={loadPageInfo} filterTransactions={filterTransactions} removeTransaction={removeTransaction} />
        </Dashboard> 
    </Provider>
}