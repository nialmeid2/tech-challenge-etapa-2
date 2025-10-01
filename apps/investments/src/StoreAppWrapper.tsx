"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import { Transaction } from "@repo/ui/model/Transaction";
import Dashboard from "@repo/ui/components/Dashboard/index";
import InvestmentsPage from "./InvestmentsPage";
import { InvestmentTransactions, TransactionTypes } from "@repo/ui/model/enums/Transaction";
export default function StoreAppWrapper({ clearLoggedUser, loadPageInfo, getInvestmentsReport }: {
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
    }>,
    getInvestmentsReport(userId: number): Promise<Record<InvestmentTransactions, {
        qtty: number;
        total: number;
    }>>
}) {
    return <Provider store={store}>
        <Dashboard clearLoggedUser={clearLoggedUser} loadPageInfo={loadPageInfo}>
            <InvestmentsPage getInvestmentsReport={getInvestmentsReport}/>
        </Dashboard>
    </Provider>
}