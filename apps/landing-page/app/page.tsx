import App from "@/src/App";
import { cookies } from "next/headers";
import { createUser, createUserCookie, emailExists, getRefreshedData, getUserCookie, loginUser, User } from "@repo/ui/model/User";

import { redirect, RedirectType } from "next/navigation";
import { getStatement } from "@repo/ui/model/Transaction";

import StoreAppWrapper from "@/src/StoreAppWrapper";
import { getLoggedUser } from "@repo/ui/serverActions";

export default async function Home() {

    
    
    const cachedUser = await getLoggedUser();

    
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

    if (cachedUser?.id) {
        redirect('/dashboard', RedirectType.replace)
    }

    return (
        <StoreAppWrapper doLogin={doLogin} checkEmail={checkEmail} doSignUp={doSignUp} />
    );
}
