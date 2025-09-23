import App from "@/src/App";
import { cookies } from "next/headers";
import { createUser, createUserCookie, emailExists, getRefreshedData, getUserCookie, loginUser, User } from "@repo/ui/model/User";

import { redirect, RedirectType } from "next/navigation";
import { getStatement } from "@repo/ui/model/Transaction";

import StoreAppWrapper from "@/src/StoreAppWrapper";

export default async function Home() {

    async function getLoggedUser() {
        "use server";

        const theCookies = await cookies();
        return getUserCookie(theCookies);
    }

    async function clearLoggedUser() {
        "use server"

        const theCookies = await cookies();
        theCookies.delete('user');
    }


    const cachedUser = await getLoggedUser();


    async function loadPageInfo() {
        "use server"

        const loggedUser = await getUserCookie(await cookies());

        if (!loggedUser) {
            redirect('/', RedirectType.replace)
        }

        const refreshedData = await getRefreshedData(loggedUser.id) ?? loggedUser;

        const refreshedUser = { ...refreshedData, password: '', id: loggedUser.id }

        const statement = await getStatement(loggedUser.id, 5,)

        return { statement, loggedUser: refreshedUser }
    }

    async function doLogin(email: string, password: string) {
        "use server"

        try {
            const loggedUser = await loginUser({ email, password } as User)

            if (!loggedUser)
                return undefined;

            await createUserCookie((await cookies()), loggedUser);

            return loggedUser;

        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async function doSignUp(user: Omit<User, "id">) {
        "use server"

        try {
            const createdUser = await createUser(user);
            console.log(createdUser)
            await createUserCookie((await cookies()), createdUser);
            return createdUser;
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

    async function checkEmail(email: string) {
        "use server"

        try {
            return await emailExists(email);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    return (
        <StoreAppWrapper doLogin={doLogin} checkEmail={checkEmail} doSignUp={doSignUp} />
    );
}
