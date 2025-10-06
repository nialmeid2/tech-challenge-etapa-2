import { createAsyncThunk, createSlice, isAnyOf, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { Transaction } from "../../model/Transaction";
import { SerializableUser } from "./LoginReducer";
import { User } from "../../model/User";
import { transactionsPerPage, TransactionTypes } from "../../model/enums/Transaction";
import { LoadedPageInfo, loadPageInfo, MainPageInfo } from "../../serverActions";
import { updateAccountInfo } from "./AccountReducer";

export interface SerializableTransaction extends Omit<Transaction, "createdAt"> {
    createdAt: string
}

export interface OperationsState {
    statetement: SerializableTransaction[],
    isMenuOpen: boolean,
    transactions: SerializableTransaction[],
    sessionUser: SerializableUser,
    attachment: string | ArrayBuffer | null | undefined,
    filterOptions: {
        alreadyEnded: boolean,
        currPage: number,
        lastFilters: { date: string | undefined, type: TransactionTypes | undefined },
        transactionsPerPage: number
    }
    errFields: {
        transactionType: string,
        value: string,
        img: string
    }
    errList: Record<number, string>
    graphData: {
        labels: string[],
        datasets: {
            label: string,
            data: number[],
            backgroundColor: string[],
            hoverOffset: number
        }[]
    } | undefined;
}

type PossibleFields = 'transactionType' | 'value' | `img`;

function defaultFields() {
    return { transactionType: '', value: '', img: '' }
}

function addNewErrField(state: WritableDraft<OperationsState>, field: PossibleFields, value: string) {
    state.errFields[field] = value;
}

function removeOrEditFulfilled(state: WritableDraft<OperationsState>, payload: ErrorStmt | SerializableInfoWithId) {

    const stmt = payload;

    if ((stmt as ErrorStmt)?.msg) {
        const newErrList = {} as Record<number, string>;
        const err = stmt as ErrorStmt;
        newErrList[err.id] = err.msg;
        state.errList = newErrList;
        return false;
    }

    state.errList = {};
    state.errFields = defaultFields()
    state.statetement = (payload as SerializableInfoWithId).statement;
    state.sessionUser = (payload as SerializableInfoWithId).loggedUser;
    state.graphData = (payload as SerializableInfoWithId).graphData
    return true;

}

const operationSlice = createSlice({
    name: 'operations',
    initialState: {
        statetement: [],
        transactions: [],
        attachment: undefined,
        isMenuOpen: false,
        sessionUser: {} as SerializableUser,
        filterOptions: {
            alreadyEnded: false,
            currPage: 1,
            lastFilters: { date: undefined, type: undefined },
            transactionsPerPage: transactionsPerPage
        },
        errFields: defaultFields(),
        errList: {},
        graphData: undefined
    } as OperationsState,
    reducers: {
        toggleMenu: (state) => {
            state.isMenuOpen = !state.isMenuOpen;
        },
        closeMenu: (state) => {
            state.isMenuOpen = false;
        },
        resetErrFields: (state) => {
            state.errFields = defaultFields();
            state.errList = {};
        },
        saveAttachment: (state, action: { payload: string | ArrayBuffer | null | undefined }) => {
            state.attachment = action.payload;
        },
        addErrField: (state, action: { payload: { field: PossibleFields, value: string } }) => {
            addNewErrField(state, action.payload.field, action.payload.value);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadNextPage.fulfilled, (state, action) => {
                const newTransactions = action.payload;
                if (newTransactions.length == 0 || newTransactions.length % transactionsPerPage != 0)
                    state.filterOptions.alreadyEnded = true;

                state.transactions = [...state.transactions, ...newTransactions]
                state.filterOptions.currPage += 1;
            })
            .addCase(removeTransactionById.fulfilled, (state, action) => {
                if (removeOrEditFulfilled(state, action.payload))
                    state.transactions = state.transactions.filter((tobj) => tobj.id != action.payload.id)

            })
            .addCase(editTransaction.fulfilled, (state, action) => {
                if (removeOrEditFulfilled(state, action.payload)) {
                    const theIndex = state.transactions.findIndex((t) => t.id == action.payload.id);
                    state.transactions[theIndex]!.value = (action.payload as SerializableInfoWithIdAndValue).value
                }
            })
            .addCase(addFilters.pending, (state) => {
                state.filterOptions.lastFilters = { date: undefined, type: undefined }
                state.filterOptions.alreadyEnded = false;
            })
            .addCase(addFilters.fulfilled, (state, action) => {

                state.filterOptions.currPage = 1;
                state.filterOptions.lastFilters = action.payload.filters;

                if (action.payload.transactions.length % transactionsPerPage != 0)
                    state.filterOptions.alreadyEnded = true;

                state.transactions = action.payload.transactions;

            })
            .addCase(updateAccountInfo.fulfilled, (state, action) => {
                const { newName } = action.payload;

                if (newName)
                    state.sessionUser.name = newName;
            })
            .addCase(createOperation.pending, (state) => {
                state.errFields = defaultFields();
                state.errList = {};
            })
            .addMatcher(isAnyOf(getUserStatement.fulfilled, createOperation.fulfilled),
                (state, action) => {
                    state.statetement = action.payload.statement;
                    state.sessionUser = action.payload.loggedUser;
                    state.graphData = action.payload.graphData;
                })
            .addMatcher(isAnyOf(getUserStatement.rejected, createOperation.rejected, loadNextPage.rejected, removeTransactionById.rejected,
                addFilters.rejected, editTransaction.rejected),
                (state, action) => {
                    console.error(action.error);
                })
    }
})

export const getUserStatement = createAsyncThunk(
    "operation/userStatement",
    async (payload: {
        loadPageInfo: () => LoadedPageInfo
    }) => {
        const pageInfo = await payload.loadPageInfo();

        return getSerializablePageInfo(pageInfo);
    }
);


export const createOperation = createAsyncThunk(
    "operation/create",
    async (payload: {
        user: User,
        transaction: Omit<Transaction, "id">,
        createATransactionOperation: (user: User, transactionObject: Omit<Transaction, "id">) => Promise<void>,
        loadPageInfo: () => LoadedPageInfo
    }) => {
        await payload.createATransactionOperation(payload.user, payload.transaction);

        const pageInfo = await payload.loadPageInfo();

        return getSerializablePageInfo(pageInfo);
    }
)

export const loadNextPage = createAsyncThunk(
    "operations/filter",
    async (payload: {
        user: User, lastFilters: { date: Date | undefined, type: TransactionTypes | undefined },
        currPage: number,
        filterTransactions: (userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page: number) => Promise<Transaction[]>
    }) => {

        const transactions = await payload.filterTransactions(payload.user?.id ?? 0, payload.lastFilters.date, payload.lastFilters.type, payload.currPage + 1);

        return transactions.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }))

    }
)

export const removeTransactionById = createAsyncThunk(
    "operations/removeById",
    async (payload: {
        id: number,
        removeTransaction: (transactionId: number) => Promise<string>,
        loadPageInfo: () => LoadedPageInfo
    }) => {
        const stmt = await payload.removeTransaction(payload.id);

        if (stmt)
            return { msg: stmt, id: payload.id } as ErrorStmt;

        const pageInfo = await payload.loadPageInfo();



        return { ...getSerializablePageInfo(pageInfo), id: payload.id } as SerializableInfoWithId;

    }
)

export const editTransaction = createAsyncThunk(
    "operations/editTransaction",
    async (payload: {
        transactionId: number,
        transactionValue: number,
        editTheTransaction: (transactionId: number, transactionValue: number) => Promise<string>,
        loadPageInfo: () => LoadedPageInfo
    }) => {

        const { transactionId, transactionValue } = payload;

        const stmt = await payload.editTheTransaction(transactionId, transactionValue);

        if (stmt)
            return { msg: stmt, id: transactionId } as ErrorStmt;

        const pageInfo = await payload.loadPageInfo();



        return { ...getSerializablePageInfo(pageInfo), id: transactionId, value: transactionValue } as SerializableInfoWithIdAndValue;
    }
)

export const addFilters = createAsyncThunk(
    "operations/newFilters",
    async (payload: {
        filterTransactions: (userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page: number) => Promise<Transaction[]>,
        user: User,
        lastFilters: { date: Date | undefined, type: TransactionTypes | undefined }
    }) => {

        const { filterTransactions, user, lastFilters } = payload;

        const transactions = await filterTransactions(user?.id ?? 0, lastFilters.date, lastFilters.type, 1);
        const serializableTransactions = transactions.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }))

        return { transactions: serializableTransactions, filters: { ...lastFilters, date: lastFilters.date?.toISOString() } }

    }
)



interface SerializableInfoWithId extends SerializablePageInfo {
    id: number
}

interface SerializableInfoWithIdAndValue extends SerializableInfoWithId {
    value: number
}

interface ErrorStmt {
    msg: string,
    id: number
}

function getSerializablePageInfo(pageInfo: MainPageInfo) {
    const returnedUser = { ...pageInfo.loggedUser, createdAt: pageInfo.loggedUser.createdAt.toISOString() };
    const returnedStatement = pageInfo.statement.map((s) => { return { ...s, createdAt: s.createdAt.toISOString() } })
    const graphData = pageInfo.graphData;


    return { statement: returnedStatement, loggedUser: returnedUser, graphData }
}

export interface Serializabletransaction extends Omit<Transaction, "createdAt"> {
    createdAt: string
}

export interface SerializablePageInfo {
    statement: SerializableTransaction[],
    loggedUser: SerializableUser,
    graphData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            hoverOffset: number;
        }[];
    }
}


export const { toggleMenu, closeMenu, addErrField, saveAttachment } = operationSlice.actions

const operationsReducer = operationSlice.reducer;
export default operationsReducer;