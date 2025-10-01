import StoreAppWrapper from "@/src/StoreAppWrapper";
import { getInvestmentsSummary } from "@repo/ui/model/Investment";
import { clearLoggedUser, loadPageInfo } from "@repo/ui/serverActions/index";

export default function InvestmentsRoute() {

    async function getInvestmentsReport(userId: number) {
        "use server"

        return await getInvestmentsSummary(userId);        
    }

    

    return <StoreAppWrapper clearLoggedUser={clearLoggedUser} getInvestmentsReport={getInvestmentsReport}
                loadPageInfo={loadPageInfo} />
    
}