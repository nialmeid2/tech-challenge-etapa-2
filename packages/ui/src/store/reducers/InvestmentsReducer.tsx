import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { InvestmentTransactions } from "../../model/enums/Transaction";
import { SerializableUser } from "./LoginReducer";

export interface InvestmentsState {
    investments: Record<InvestmentTransactions, InvestmentData> | undefined,
    total: number
}

const invesmentsSlice = createSlice({
    name: 'investments',
    initialState: {
        investments: undefined,
        total: 0
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
                let theTotal = 0;

                for (let iType in result) {
                    theTotal += result[iType as InvestmentTransactions].total;
                    allInvestments[iType as InvestmentTransactions] = result[iType as InvestmentTransactions];
                }

                state.investments = allInvestments;
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