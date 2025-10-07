"use client"

import ButtonPrimary from "@repo/ui/components/ButtonPrimary"
import ButtonPrimaryBlack from "@repo/ui/components/ButtonPrimary/ButtonPrimaryBlack"
import ButtonPrimaryOutlinedBlack from "@repo/ui/components/ButtonPrimaryOutlined/ButtonPrimaryOutlinedBlack"
import ButtonSecondary from "@repo/ui/components/ButtonSecondary"
import Container from "@repo/ui/components/Container"
import LoadingScreen from "@repo/ui/components/LoadingScreen"
import { User } from "@repo/ui/model/User"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import HomeHeader from "./Header"
import HomeFooter from "./Footer"
import { isPassSecure } from "@repo/ui/model/utils/str"
import { addLoginErrMessage, createNewUser, resetLoginErrMessages, attemptLogin } from "@repo/ui/store/reducers/LoginReducer"
import { AppDispatch, useAppSelector } from "@repo/ui/store/store"
import { useDispatch } from "react-redux"
import Image from "next/image"

export default function App({ doLogin, doSignUp, checkEmail }: {
    doLogin: (email: string, password: string) => Promise<User | undefined>,
    doSignUp: (user: Omit<User, "id">) => Promise<User>,
    checkEmail: (email: string) => Promise<boolean>

}) {

    const [modalNewAccountVisible, setModalNewAccountVisible] = useState(false);
    const [modalLoginVisible, setModalLoginVisible] = useState(false);
    //const { setIsLoading, loginCreatedUser, user: loggedUser } = useSelector()

    const loggedUser = useAppSelector((s) => s.loginSlice.loggedUser);
    const errField = useAppSelector((s) => s.loginSlice.errField);
    const errMsg = useAppSelector((s) => s.loginSlice.errMsg);
    const dispatch = useDispatch<AppDispatch>();

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const newPassRef = useRef<HTMLInputElement>(null);
    const loginRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);




    function submitNewAccount(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); // no submitting!

        dispatch(resetLoginErrMessages());

        let isValid = true;

        const newUser = {
            name: nameRef.current?.value,
            email: emailRef.current?.value,
            password: newPassRef.current?.value
        } as Omit<User, "id">

        if (!newUser.name?.trim()) {
            dispatch(addLoginErrMessage({ field: 'name', msg: 'O nome é obrigatório' }))
            isValid = false;
        }
        if (!newUser.email?.trim()) {
            dispatch(addLoginErrMessage({ field: 'email', msg: 'O e-mail é obrigatório' }))
            isValid = false;
        } else if (!/.+\@.+\..+/gi.test(newUser.email)) {
            dispatch(addLoginErrMessage({ field: 'email', msg: 'O e-mail deve ter o formato exemplo@dominio.com' }))
            isValid = false;
        }

        if (!newUser.password) {

            dispatch(addLoginErrMessage({ field: 'newPass', msg: 'A senha é obrigatória' }))

            isValid = false;
        } else if (!isPassSecure(newUser.password)) {

            dispatch(addLoginErrMessage({ field: 'newPass', msg: 'A senha deve conter 8 ou mais caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial' }))

            isValid = false;
        }

        if (!isValid)
            return;



        dispatch(createNewUser({ newUser, checkEmail, doSignUp }));


    }

    function submitLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        dispatch(resetLoginErrMessages());

        let isValid = true;
        const loginInfo = {
            email: loginRef.current?.value,
            pass: passRef.current?.value
        }



        if (!loginInfo.email) {

            dispatch(addLoginErrMessage({ field: 'login', msg: 'O e-mail é obrigatório' }))
            isValid = false;
        }
        if (!loginInfo.pass) {

            dispatch(addLoginErrMessage({ field: 'pass', msg: 'A senha é obrigatória' }))
            isValid = false;
        }

        if (!isValid)
            return;

        dispatch(attemptLogin({ email: loginInfo.email!, pass: loginInfo.pass!, doLogin }));


    }

    function emptyFields() {
        nameRef.current!.value = "";
        emailRef.current!.value = "";
        newPassRef.current!.value = "";
        loginRef.current!.value = "";
        passRef.current!.value = "";



        dispatch(resetLoginErrMessages())
    }


    useEffect(() => {
        if (loggedUser?.id)
            location.replace('/dashboard')
    });


    return <div className="flex-1 flex flex-col">

        <LoadingScreen />

        <HomeHeader clickNewAccount={() => setModalNewAccountVisible(true)} clickLogin={() => setModalLoginVisible(true)} />

        <main className="flex-1 bg-linear-to-b w-[100%] from-blue-bytebank to-white pb-[2em]">
            <Container className="flex flex-col max-[850px]:w-[90%]">
                <section className="flex gap-[1em] max-[850px]:flex-col justify-between items-center my-[2em]">
                    <blockquote className="text-[2em] max-[850px]:text-center max-[850px]:w-[80%] max-[671px]:w-[90%]">
                        <p>Experimente mais liberdade no controle da sua vida financeira.</p>
                        <p>Crie sua conta com a gente</p>
                    </blockquote>
                    <Image alt="banner da bytebank" src="/home/graph_banner.svg" className="w-[50%] max-[850px]:w-[100%]" />
                    <section className="min-[672px]:hidden flex justify-between gap-[2ch]">
                        <ButtonPrimaryBlack onClick={() => setModalNewAccountVisible(true)}>Abrir minha conta</ButtonPrimaryBlack>
                        <ButtonPrimaryOutlinedBlack onClick={() => setModalLoginVisible(true)}>Já tenho conta</ButtonPrimaryOutlinedBlack>
                    </section>
                </section>
                <section className="flex flex-col gap-1em items-center my-[2em]">
                    <section className="text-[2em] max-[671px]:text-[1.5em]">
                        <p>Vantagens do nosso banco:</p>
                    </section>
                    <section className="grid grid-cols-4 gap-[2em] mt-[1em] max-[850px]:grid-cols-2 max-[671px]:grid-cols-1">
                        <figure className="text-green-bytebank-dark  flex flex-col gap-[.25em]">
                            <Image alt="ícone de presente" src="/home/gift.svg" className="w-[4.5em] mx-auto" />
                            <figcaption className="text-center font-bold">Conta e cartão corporativos</figcaption>
                            <p className="text-center text-grey-bytebank-dark mt-[.5em]">Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção.</p>
                        </figure>
                        <figure className="text-green-bytebank-dark flex flex-col gap-[.25em]">
                            <Image alt="ícone de saque" src="/home/withdraw.svg" className="w-[4.5em] mx-auto" />
                            <figcaption className="text-center font-bold">Saque sem custo</figcaption>
                            <p className="text-center text-grey-bytebank-dark mt-[.5em]">Você pade sacar gratuitamente 4x por mês de qualquer banco 24h.</p>
                        </figure>
                        <figure className="text-green-bytebank-dark flex flex-col gap-[.25em]">
                            <Image alt="ícone de estrela" src="/home/star.svg" className="w-[4.5em] mx-auto" />
                            <figcaption className="text-center font-bold">Programa de pontos</figcaption>
                            <p className="text-center text-grey-bytebank-dark mt-[.5em]">Você pade acumular pontos com suas compras no crédito sem pagar mensalidade!</p>
                        </figure>
                        <figure className="text-green-bytebank-dark flex flex-col gap-[.25em]">
                            <Image alt="ícone de dispositivos" src="/home/devices.svg" className="w-[4.5em] mx-auto" />
                            <figcaption className="text-center font-bold">Seguro dispositivos</figcaption>
                            <p className="text-center text-grey-bytebank-dark mt-[.5em]">Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.</p>
                        </figure>
                    </section>
                </section>

            </Container>
        </main>

        <HomeFooter />

        <aside className={`flex fixed translate-x-[-50%] left-[50%] top-[0] w-[49.5em] max-w-[90%] h-[100vh] z-[99] ${modalNewAccountVisible ? '' : 'hidden'} bg-[#f8f8f8]`}>
            <button className="absolute cursor-pointer top-[1em] right-[1em]" onClick={() => { setModalNewAccountVisible(false); emptyFields() }}>
                <Image src="/home/x.svg" alt="fechar" className="h-[1em]" />
            </button>

            <form onSubmit={(e) => submitNewAccount(e)} className="flex flex-col p-[2em] py-[1em] w-[100%] max-[490px]:p-[1em]">
                <Image src="/home/girl_on_pc.svg" alt="Cadastro de usuário" className="h-[20em] mx-auto" />
                <fieldset className="flex flex-col mx-[10%]">
                    <legend className="font-bold mb-[1em]">Preencha os campos abaixo para criar sua conta corrente!</legend>
                    <section className="flex flex-col gap-[.25em] mb-[1em]">
                        <label htmlFor="name" className="font-bold">Nome</label>
                        <input ref={nameRef} id="name" type="text" placeholder="Digite seu nome completo"
                            className={`p-[.5em] w-[100%] border-[.1em]  rounded-[.25em] bg-white ${errField.includes('name') ? 'border-red-bytebank-dark' : 'border-grey-bytebank'}`} />
                        {errField.includes('name') && <span className="text-red-bytebank-dark font-bold">{errMsg.name}</span>}
                    </section>
                    <section className="flex flex-col gap-[.25em] mb-[1em]">
                        <label htmlFor="email" className="font-bold">Email</label>
                        <input ref={emailRef} id="email" type="text" placeholder="Digite seu e-mail"
                            className={`p-[.5em] w-[100%] border-[.1em]  rounded-[.25em] bg-white ${errField.includes('email') ? 'border-red-bytebank-dark' : 'border-grey-bytebank'}`} />
                        {errField.includes('email') && <span className="text-red-bytebank-dark font-bold">{errMsg.email}</span>}
                    </section>
                    <section className="flex flex-col gap-[.25em] mb-[1em]">
                        <label htmlFor="newPass" className="font-bold">Senha</label>
                        <input ref={newPassRef} id="newPass" type="password" placeholder="Digite sua senha"
                            className={`p-[.5em] w-[100%] border-[.1em]  rounded-[.25em] bg-white ${errField.includes('newPass') ? 'border-red-bytebank-dark' : 'border-grey-bytebank'}`} />
                        {errField.includes('newPass') && <span className="text-red-bytebank-dark font-bold">{errMsg.newPass}</span>}
                    </section>
                    <ButtonSecondary type="submit" className="mt-[1em] w-[50%] self-center">
                        Criar Conta
                    </ButtonSecondary>
                </fieldset>
            </form>
        </aside>

        <aside className={`flex fixed translate-x-[-50%] left-[50%] top-[0] w-[49.5em] max-w-[90%] h-[100vh] z-[99] ${modalLoginVisible ? '' : 'hidden'} bg-[#f8f8f8]`}>
            <button className="absolute cursor-pointer top-[1em] right-[1em]" onClick={() => { setModalLoginVisible(false); emptyFields() }}>
                <Image src="/home/x.svg" alt="fechar" className="h-[1em]" />
            </button>

            <form onSubmit={(e) => submitLogin(e)} className="flex flex-col p-[2em] py-[1em] w-[100%] max-[490px]:p-[1em]">
                <Image src="/home/boy_on_a_phone.svg" alt="Entrar na sua conta" className="h-[20em] mx-auto" />
                <fieldset className="flex flex-col mx-[10%]">
                    <legend className="font-bold mb-[1em]">Login</legend>
                    <section className="flex flex-col gap-[.25em] mb-[1em]">
                        <label htmlFor="login" className="font-bold">Email</label>
                        <input ref={loginRef} id="login" type="text" placeholder="Digite seu e-mail"
                            className={`p-[.5em] w-[100%] border-[.1em]  rounded-[.25em] bg-white ${errField.includes('login') ? 'border-red-bytebank-dark' : 'border-grey-bytebank'}`} />
                        {errField.includes('login') && <span className="text-red-bytebank-dark font-bold">{errMsg.login}</span>}
                    </section>
                    <section className="flex flex-col gap-[.25em] mb-[1em]">
                        <label htmlFor="pass" className="font-bold">Senha</label>
                        <input ref={passRef} id="pass" type="password" placeholder="Digite sua senha"
                            className={`p-[.5em] w-[100%] border-[.1em]  rounded-[.25em] bg-white ${errField.includes('pass') ? 'border-red-bytebank-dark' : 'border-grey-bytebank'}`} />
                        {errField.includes('pass') && <span className="text-red-bytebank-dark font-bold">{errMsg.pass}</span>}
                    </section>
                    <ButtonPrimary type="submit" className="mt-[1em] w-[50%] self-center">
                        Acessar
                    </ButtonPrimary>
                </fieldset>
            </form>

        </aside>

        <button className={`fixed left-[0] top-[0] w-[100vw] h-[100vh] bg-black/50 z-[98] ${modalNewAccountVisible || modalLoginVisible ? '' : 'hidden'}`}
            onClick={() => { setModalNewAccountVisible(false); setModalLoginVisible(false); emptyFields(); }}>
        </button>

        <LoadingScreen />

    </div>
}

