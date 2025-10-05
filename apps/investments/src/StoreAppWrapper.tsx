"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import Dashboard from "@repo/ui/components/Dashboard/index";
import InvestmentsPage from "./InvestmentsPage";
import { InvestmentTransactions } from "@repo/ui/model/enums/Transaction";
import { LoadedPageInfo } from "@repo/ui/serverActions/index";
export default function StoreAppWrapper({ clearLoggedUser, loadPageInfo, getInvestmentsReport }: {
    clearLoggedUser: () => Promise<void>,
    loadPageInfo: () => LoadedPageInfo,
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