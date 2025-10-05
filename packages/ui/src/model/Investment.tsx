import db from "../db/db";
import { InvestmentTransactions, TransactionTypes } from "./enums/Transaction";


export const InvestmentTypes = [
    TransactionTypes.INVESTIMENT_FUNDS,
    TransactionTypes.DIRECT_TREASURY,
    TransactionTypes.PRIVATE_RETIREMENT,
    TransactionTypes.STOCKS,
    TransactionTypes.INTEREST 
]

export async function getInvestmentsSummary(userId: number) {
    "use server"

    function defaultReportLine() {
        return {qtty: 0, total: 0}
    }

    try {


        const investments: Record<InvestmentTransactions, { qtty: number, total: number }> = {
            [TransactionTypes.INVESTIMENT_FUNDS]: defaultReportLine(),
            [TransactionTypes.DIRECT_TREASURY]: defaultReportLine(),
            [TransactionTypes.PRIVATE_RETIREMENT]: defaultReportLine(),
            [TransactionTypes.STOCKS]: defaultReportLine(),
            [TransactionTypes.INTEREST]: defaultReportLine()
        }

        for (let iType in investments) {

            const totalForInvestment = await db.transaction.aggregate({
                where: { type: iType, userId: userId },
                _sum: { value: true },
                _count: true
            })

            investments[iType as InvestmentTransactions].total = totalForInvestment._sum.value ?? 0;
            investments[iType as InvestmentTransactions].qtty = totalForInvestment._count;
        }


        await db.$disconnect();

        return investments;

    } catch (err) {
        console.log(err);
        throw err;
    }
}