import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { InvestmentTransactions, TransactionTypes } from "../../model/enums/Transaction";
import { SerializableUser } from "./LoginReducer";


export interface InvestmentsState {
    investments: Record<InvestmentTransactions, InvestmentData> | undefined,
    investmentGraph: {
        labels: string[],
        datasets: {
            label: string,
            data: number[],
            backgroundColor: string[],
            hoverOffset: number
        }[]
    } | undefined
    total: number
}

const invesmentsSlice = createSlice({
    name: 'investments',
    initialState: {
        investments: undefined,
        total: 0,
        investmentGraph: undefined
    } as InvestmentsState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserInvestments.fulfilled, (state, action) => {

                const result = action.payload;

                if (!result)
                    return;

                const allInvestments = {} as Record<InvestmentTransactions, InvestmentData>;
                const investmentLabels = {
                    [TransactionTypes.INVESTIMENT_FUNDS]: "Fundos de Investimento",
                    [TransactionTypes.DIRECT_TREASURY]: "Tesouro Direto",
                    [TransactionTypes.PRIVATE_RETIREMENT]: "Previdência Privada",
                    [TransactionTypes.STOCKS]: "Bolsa de Valores",
                    [TransactionTypes.INTEREST]: "Rendimento de investimentos"
                }

                let theTotal = 0;

                const graphData = {
                    labels: [] as string[],
                    datasets: [{
                        label: '',
                        data: [] as number[],
                        backgroundColor: [] as string[],
                        hoverOffset: 4
                    }]
                }

                graphData.datasets[0]!.backgroundColor = [
                    '#004D61',                    
                    '#3e95f9',
                    '#e4ede3',
                    '#024f4e',
                    '#47a138'
                ]

                console.log(result);

                for (const iType in result) {
                    const investmentTotal = result[iType as InvestmentTransactions].total
                    theTotal += investmentTotal;
                    allInvestments[iType as InvestmentTransactions] = result[iType as InvestmentTransactions];
                    graphData.labels.push(investmentLabels[iType as InvestmentTransactions]);
                    graphData.datasets[0]!.label = "Total"
                    graphData.datasets[0]!.data.push(investmentTotal);
                }

                state.investments = allInvestments;
                state.investmentGraph = graphData;
                state.total = theTotal;

            })
            .addMatcher(isAnyOf(loadUserInvestments.rejected), (state, action) => {
                console.error(action.error)
            })
    }
})

type InvestmentData = { qtty: number; total: number; };

export const loadUserInvestments = createAsyncThunk(
    "investments/load",
    async (payload: {
        user: SerializableUser,
        getInvestmentsReport: (userId: number) => Promise<Record<InvestmentTransactions, InvestmentData>>,
    }) => {
        const { getInvestmentsReport, user } = payload;

        const result = await getInvestmentsReport(user.id);

        return result;


    }
)

export default invesmentsSlice.reducer;