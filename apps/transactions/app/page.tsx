
import StoreAppWrapper from "@/src/StoreAppWrapper";
import { TransactionTypes } from "@repo/ui/model/enums/Transaction";
import { addAdditiveOperation, addSubtractiveOperation, editATransaction, getFilteredTransactions, removeATransaction, Transaction } from "@repo/ui/model/Transaction";
import { User } from "@repo/ui/model/User";
import { clearLoggedUser, getLoggedUser, loadPageInfo } from "@repo/ui/serverActions/index";
import { redirect, RedirectType } from "next/navigation";


export default async function TransactionsRoute() {

    async function filterTransactions(userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page = 1) { 
        "use server"
        return await getFilteredTransactions(userId, date, transactionType, page) as Transaction[]
    }

    async function removeTransaction(transactionId: number) {
        "use server"
        return await removeATransaction(transactionId) as string;
    }

    async function editTheTransaction(transactionId: number, value: number) {
        "use server"

        return await editATransaction(transactionId, value) as string;
    }
    
    const cachedUser = await getLoggedUser();
    
    if (!cachedUser)
        redirect('/', RedirectType.replace)

    return <StoreAppWrapper clearLoggedUser={clearLoggedUser} filterTransactions={filterTransactions} removeTransaction={removeTransaction}
                loadPageInfo={loadPageInfo} editTheTransaction={editTheTransaction} />
}