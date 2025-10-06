"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import { Transaction } from "@repo/ui/model/Transaction";
import Dashboard from "@repo/ui/components/Dashboard/index";
import TransactionsPage from "./TransactionsPage";
import { TransactionTypes } from "@repo/ui/model/enums/Transaction";
import { LoadedPageInfo } from "@repo/ui/serverActions/index";
export default function StoreAppWrapper({ clearLoggedUser, loadPageInfo, filterTransactions, removeTransaction, editTheTransaction }: {    
    clearLoggedUser: () => Promise<void>,
    filterTransactions: (userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page: number) => Promise<Transaction[]>,
    removeTransaction: (transactionId: number) => Promise<string>,
    editTheTransaction: (transactionId: number, value: number) => Promise<string>,
    loadPageInfo: () => LoadedPageInfo
}) {
    return <Provider store={store}>
        <Dashboard clearLoggedUser={clearLoggedUser} loadPageInfo={loadPageInfo}>
            <TransactionsPage loadPageInfo={loadPageInfo} filterTransactions={filterTransactions} removeTransaction={removeTransaction}
                    editTheTransaction={editTheTransaction} />
        </Dashboard> 
    </Provider>
}