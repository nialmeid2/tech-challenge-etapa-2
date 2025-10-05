"use server";

import { cookies } from "next/headers";
import { getRefreshedData, getUserCookie } from "../model/User";
import { redirect, RedirectType } from "next/navigation";
import { getStatement, getGraphData, Transaction } from "../model/Transaction";

export async function getLoggedUser() {
    "use server";

    const theCookies = await cookies();
    return getUserCookie(theCookies);
}

export async function clearLoggedUser() {
    "use server"

    const theCookies = await cookies();
    theCookies.delete('user');
}



export async function loadPageInfo(): Promise<MainPageInfo> {
    "use server"

    const loggedUser = await getUserCookie(await cookies());

    if (!loggedUser) {
        redirect('/', RedirectType.replace);
    }

    const refreshedData = await getRefreshedData(loggedUser.id) ?? loggedUser;
    const refreshedUser = { ...refreshedData, password: '', id: loggedUser.id }
    const statement = await getStatement(loggedUser.id, 5,)
    const graphData = await getGraphData(loggedUser.id)

    return { statement, loggedUser: refreshedUser, graphData }
}

export interface MainPageInfo {
    statement: Transaction[];
    loggedUser: {
        password: string;
        id: number;
        name: string;
        email: string;
        balance: number;
        createdAt: Date;
    };
    graphData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            hoverOffset: number;
        }[];
    };
}

export type LoadedPageInfo = ReturnType<typeof loadPageInfo>;
