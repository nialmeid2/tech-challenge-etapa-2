"use client"


import { Provider } from "react-redux";
import App from "./App";
import { User } from "@repo/ui/model/User";
import store from "@repo/ui/store/store";



export default function StoreAppWrapper({ doLogin, doSignUp, checkEmail }: {
    doLogin: (email: string, password: string) => Promise<User | undefined>,
    doSignUp: (user: Omit<User, "id">) => Promise<User>,
    checkEmail: (email: string) => Promise<boolean>

}) {


    return <Provider store={store} >
        <App doLogin={doLogin} checkEmail={checkEmail} doSignUp={doSignUp} />
    </Provider>
}



