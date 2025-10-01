import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Transaction } from "../../model/Transaction";
import { getUserStatement } from "./OperationsReducer";

export interface AccountState {
    errFields: ReturnType<typeof defaultErrFields>,
    successMsg: string,
    lastName: string

}

function defaultErrFields() {
    return { name: '', pass: '' }
}

const accountSlice = createSlice({
    name: 'accountSlice',
    initialState: {
        errFields: defaultErrFields(),
        successMsg: '',
        lastName: '' 
    } as AccountState,
    reducers: {
        resetAccountErrFields: (state) => {
            state.errFields = defaultErrFields();
            state.successMsg = ''
        },
        setAccountErrField: (state, action: { payload: { field: 'name' | 'pass', msg: string } }) => {
            state.errFields[action.payload.field] = action.payload.msg
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateAccountInfo.fulfilled, (state, action) => {
                const { newName, newPass } = action.payload;

                console.log(newName == state.lastName)

                if (newName == state.lastName)
                    state.successMsg = 'Senha modificada com sucesso'
                else if (!newPass)
                    state.successMsg = 'Nome modificado com sucesso'
                else
                    state.successMsg = 'Nome e Senha modificados com sucesso'

                state.lastName = newName;
            })
            .addCase(getUserStatement.fulfilled, (state, action) => {
                state.lastName = action.payload.loggedUser.name;
            })
            .addMatcher(isAnyOf(updateAccountInfo.rejected), (state, action) => {
                console.error(action.error);
            })
    }

})

export const updateAccountInfo = createAsyncThunk(
    "account/updateInfo",
    async (payload: {
        id: number,
        newName: string,
        newPass: string,
        updateUserInfo: (id: number, name: string, pass: string) => Promise<void>,
        loadPageInfo: () => Promise<{
            statement: Transaction[];
            loggedUser: {
                password: string;
                id: number;
                name: string;
                email: string;
                balance: number;
                createdAt: Date;
            };
        }>
    }) => {

        const { updateUserInfo, loadPageInfo, id, newName, newPass } = payload

        await updateUserInfo(id, newName, newPass);
        await loadPageInfo();

        return { newName, newPass: newPass ? 'a changed password' : '' };
    }
)

export const { resetAccountErrFields, setAccountErrField } = accountSlice.actions;

const accountReducer = accountSlice.reducer;
export default accountReducer;