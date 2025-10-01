"use server";

import { cookies } from "next/headers";
import { getRefreshedData, getUserCookie } from "../model/User";
import { redirect, RedirectType } from "next/navigation";
import { getStatement } from "../model/Transaction";

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



export async function loadPageInfo() {
    "use server"

    const loggedUser = await getUserCookie(await cookies());

    if (!loggedUser) {
        redirect('/', RedirectType.replace);
    }

    const refreshedData = await getRefreshedData(loggedUser.id) ?? loggedUser;
    const refreshedUser = { ...refreshedData, password: '', id: loggedUser.id }
    const statement = await getStatement(loggedUser.id, 5,)

    return { statement, loggedUser: refreshedUser }
}