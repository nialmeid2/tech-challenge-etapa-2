// reducers/usuario/index.ts

import { createAsyncThunk, createSlice, isAnyOf, WritableDraft } from "@reduxjs/toolkit";
import { User } from "../../model/User";
import { RootState } from "../store";

export interface LoginState {
    loggedUser: User,
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

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: {
        loggedUser: {} as User,
        isLoading: false,
        errField: '',
        errMsg: defaultErrMsg()
    } as LoginState,
    reducers: {
        resetErrMessages: (state) => {
            state.errField = '',
                state.errMsg = defaultErrMsg();

        },
        addErrMessage: (state, action: { payload: { field: PossibleFields, msg: string } }) => {
            addErrMessageInternally(state, action.payload.field, action.payload.msg);
        },
        // createNewUser: (state, action: {
        //     payload: {
        //         newUser: Omit<User, "id">, checkEmail: (email: string) => Promise<boolean>,
        //         doSignUp: (user: Omit<User, "id">) => Promise<User>
        //     }, type: string
        // }) => {
        //     const { doSignUp } = action.payload;

        //     state.isLoading = true;
        //     const attemptUser = action.payload.newUser!;

        //     action.payload.checkEmail(attemptUser.email)
        //         .then((exists) => {

        //             if (exists) {
        //                 addErrMessageInternally(state, 'email', `Já existe uma conta cadastrada com o e-mail ${attemptUser.email}`)
        //                 return undefined;
        //             }

        //             return doSignUp(attemptUser)
        //         })
        //         .then((createdUser) => {
        //             state.isLoading = false;

        //             if (!createdUser) {
        //                 return;
        //             }

        //             state.loggedUser = createdUser;
        //         })
        //         .catch((err) => {
        //             state.isLoading = false;
        //             console.log(err)
        //         });

        // },        
    },
    extraReducers: (builder) => {

        builder
            .addCase(attemptLogin.fulfilled, (state, { payload }) => {

                if (payload) {
                    state.loggedUser = { ...payload, createdAt: new Date(payload.createdAt) };
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

                state.loggedUser = { ...action.payload, createdAt: new Date(action.payload.createdAt) };

            })
            .addMatcher(isAnyOf(attemptLogin.pending, createNewUser.pending), (state) => {
                state.isLoading = true;
            })
            .addMatcher(isAnyOf(attemptLogin.fulfilled, createNewUser.fulfilled, attemptLogin.rejected, createNewUser.rejected), (state) => {
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

export const { resetErrMessages, addErrMessage } = loginSlice.actions; // as actions vêem dos reducers


export default loginSlice.reducer;