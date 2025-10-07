"use client"

import store from "@repo/ui/store/store";
import { Provider } from "react-redux";
import Dashboard from "@repo/ui/components/Dashboard/index";
import AccountPage from "./AccountPage";
import { LoadedPageInfo } from "@repo/ui/serverActions/index";

//import TailwindWrapper from "@repo/ui/TailwindWrapper";
import dynamic from "next/dynamic";

const TailwindWrapper = dynamic(import('@repo/ui/TailwindWrapper'), {
    ssr: false
})

export default function StoreAppWrapper({ clearLoggedUser, loadPageInfo, updateUserInfo }: {    
    clearLoggedUser: () => Promise<void>,   
    updateUserInfo(id: number, name: string, pass: string): Promise<void>, 
    loadPageInfo: () => LoadedPageInfo
}) {
    return <Provider store={store}>
        <TailwindWrapper />
        <Dashboard clearLoggedUser={clearLoggedUser} loadPageInfo={loadPageInfo}>
            <AccountPage updateUserInfo={updateUserInfo} />
        </Dashboard> 
    </Provider>
}