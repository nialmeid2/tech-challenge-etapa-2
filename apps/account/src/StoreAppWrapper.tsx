"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import Dashboard from "@repo/ui/components/Dashboard/index";
import AccountPage from "./AccountPage";
import { LoadedPageInfo } from "@repo/ui/serverActions/index";
export default function StoreAppWrapper({ clearLoggedUser, loadPageInfo, updateUserInfo }: {    
    clearLoggedUser: () => Promise<void>,   
    updateUserInfo(id: number, name: string, pass: string): Promise<void>, 
    loadPageInfo: () => LoadedPageInfo
}) {
    return <Provider store={store}>
        <Dashboard clearLoggedUser={clearLoggedUser} loadPageInfo={loadPageInfo}>
            <AccountPage loadPageInfo={loadPageInfo} updateUserInfo={updateUserInfo} />
        </Dashboard> 
    </Provider>
}