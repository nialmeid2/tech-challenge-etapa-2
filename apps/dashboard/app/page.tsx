import StoreAppWrapper from "@/src/StoreAppWrapper";
import { addAdditiveOperation, addSubtractiveOperation, Transaction } from "@repo/ui/model/Transaction";
import { User } from "@repo/ui/model/User";
import { clearLoggedUser, getLoggedUser, loadPageInfo } from "@repo/ui/serverActions/index";
import { redirect, RedirectType } from "next/navigation";


export default async function DashboardPage() {

    async function createAdditiveOperation(user: User, transaction: Omit<Transaction, "id">) {
        "use server"

        await addAdditiveOperation(user, transaction);
        return;
    }

    async function createSubtractiveOperation(user: User, transaction: Omit<Transaction, "id">) {
        "use server"

        await addSubtractiveOperation(user, transaction);
        return;
    }

    const cachedUser = await getLoggedUser()

    if (!cachedUser)
        redirect('/', RedirectType.replace)

    return <StoreAppWrapper createAdditiveOperation={createAdditiveOperation} createSubtractiveOperation={createSubtractiveOperation} clearLoggedUser={clearLoggedUser}
                loadPageInfo={loadPageInfo} />
}