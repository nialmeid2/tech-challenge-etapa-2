// reducers/usuario/index.ts

import { createAsyncThunk, createSlice, isAnyOf, WritableDraft } from "@reduxjs/toolkit";
import { User } from "../../model/User";
import { createOperation, loadNextPage, getUserStatement, removeTransactionById, addFilters } from "./OperationsReducer";
import { loadUserInvestments } from "./InvestmentsReducer";
import { updateAccountInfo } from "./AccountReducer";

export interface LoginState {
    loggedUser: SerializableUser,
    isLoading: boolean,
    errField: string,
    errMsg: PossibleErrMessages;
}

export type PossibleErrMessages = { email: string, name: string, newPass: string, login: string, pass: string }

type PossibleFields = 'email' | 'name' | 'newPass' | 'login' | 'pass';

function defaultErrMsg() {

    return { email: '', name: '', newPass: '', login: '', pass: '' }
}

function addErrMessageInternally(state: WritableDraft<LoginState>, field: PossibleFields, msg: string) {
    state.errField = `${state.errField}-${field}`;
    state.errMsg[field] = msg;
}

export interface SerializableUser extends Omit<User, "createdAt"> {
    createdAt: string
}

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: {
        loggedUser: {} as SerializableUser,
        isLoading: false,
        errField: '',
        errMsg: defaultErrMsg()
    } as LoginState,
    reducers: {
        resetLoginErrMessages: (state) => {
            state.errField = '',
                state.errMsg = defaultErrMsg();

        },
        addLoginErrMessage: (state, action: { payload: { field: PossibleFields, msg: string } }) => {
            addErrMessageInternally(state, action.payload.field, action.payload.msg);
        },    
    },
    extraReducers: (builder) => {

        builder
            .addCase(attemptLogin.fulfilled, (state, { payload }) => {

                if (payload) {
                    state.loggedUser = payload;
                }
                else {

                    addErrMessageInternally(state, 'pass', 'Usuário/Senha incorretos');
                    addErrMessageInternally(state, 'login', 'Usuário/Senha incorretos');

                    console.log(state.errField)
                }
            })
            .addCase(attemptLogin.rejected, (state, action) => {
                addErrMessageInternally(state, 'pass', 'Erro durante login')
                addErrMessageInternally(state, 'login', 'Erro durante login')

                console.error(action.error)

            })
            .addCase(createNewUser.rejected, (state, action) => {
                addErrMessageInternally(state, 'email', 'Erro durante criação de usuário')
                addErrMessageInternally(state, 'name', 'Erro durante criação de usuário')
                addErrMessageInternally(state, 'newPass', 'Erro durante criação de usuário')

                console.error(action.error)
            })
            .addCase(createNewUser.fulfilled, (state, action) => {


                if (!action.payload.id) {
                    addErrMessageInternally(state, 'email', `Já existe uma conta cadastrada com o e-mail ${action.payload.email}`)
                    return;
                }

                state.loggedUser = action.payload;

            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loggedUser = {} as SerializableUser
            })
            .addMatcher(isAnyOf(attemptLogin.pending, createNewUser.pending, logoutUser.pending, getUserStatement.pending, createOperation.pending,
                loadNextPage.pending, removeTransactionById.pending, addFilters.pending, loadUserInvestments.pending, updateAccountInfo.pending
            ), (state) => {
                state.isLoading = true;
            })
            .addMatcher(isAnyOf(attemptLogin.fulfilled, createNewUser.fulfilled, logoutUser.fulfilled, getUserStatement.fulfilled, createOperation.fulfilled, 
                loadNextPage.fulfilled, removeTransactionById.fulfilled, addFilters.fulfilled, loadUserInvestments.fulfilled, updateAccountInfo.fulfilled,
                attemptLogin.rejected, createNewUser.rejected, logoutUser.rejected, getUserStatement.rejected, createOperation.rejected, 
                loadNextPage.rejected, removeTransactionById.rejected, addFilters.rejected, loadUserInvestments.rejected, updateAccountInfo.rejected),
                (state) => {
                    state.isLoading = false;
                })
    }

})


export const attemptLogin = createAsyncThunk(
    "user/attemptLogin",
    async (payload: {
        email: string, pass: string, doLogin: (email: string, password: string) => Promise<User | undefined>
    }) => {

        const user = await payload.doLogin(payload.email!, payload.pass!);

        if (!user?.id) {
            return undefined;
        }

        return { ...user, createdAt: user.createdAt.toISOString() };
    }
)

export const createNewUser = createAsyncThunk(
    "user/createNewUser",
    async (payload: {
        newUser: Omit<User, "id">, checkEmail: (email: string) => Promise<boolean>,
        doSignUp: (user: Omit<User, "id">) => Promise<User>
    }
    ) => {

        const attemptUser = payload.newUser!;

        const preExistantUser = await payload.checkEmail(attemptUser.email);


        if (preExistantUser) { // user already exists??
            return { email: attemptUser.email, id: undefined };
        }

        const createdUser = await payload.doSignUp(attemptUser);


        if (!createdUser) {
            throw new Error("Error creating user");
        }

        return {
            ...createdUser,
            createdAt: createdUser.createdAt.toISOString()
        };


    },
)

export const logoutUser = createAsyncThunk(
    "user/logout",
    async (payload: {clearLoggedUser: () => Promise<void>}) => {
        await payload.clearLoggedUser();
    }
)

export const { resetLoginErrMessages, addLoginErrMessage } = loginSlice.actions; // as actions vêem dos reducers


export default loginSlice.reducer;