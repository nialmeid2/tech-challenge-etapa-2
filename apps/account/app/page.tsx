import StoreAppWrapper from "@/src/StoreAppWrapper"
import { updateUser } from "@repo/ui/model/User"
import { clearLoggedUser, loadPageInfo } from "@repo/ui/serverActions/index"



export default function AccountRoute() {
    
    async function updateUserInfo(id: number, name: string, pass: string) {
        "use server"

        updateUser(id, name, pass)

    }

    return <StoreAppWrapper clearLoggedUser={clearLoggedUser} loadPageInfo={loadPageInfo} updateUserInfo={updateUserInfo} />
}