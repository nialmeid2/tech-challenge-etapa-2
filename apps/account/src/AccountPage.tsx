"use client"

import ButtonSecondary from "@repo/ui/components/ButtonSecondary/index";
import Input from "@repo/ui/components/Input/index";
import { isPassSecure } from "@repo/ui/model/utils/str.ts";
import { resetAccountErrFields, setAccountErrField, updateAccountInfo } from "@repo/ui/store/reducers/AccountReducer";
import { AppDispatch, useAppSelector } from "@repo/ui/store/store";
import { FormEvent, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";


export default function AccountPage({ updateUserInfo }: {
    updateUserInfo: (id: number, name: string, pass: string) => Promise<void>,
    
}) {

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    
    const user = useAppSelector(s => s.operationSlice.sessionUser);
    const lastName = useAppSelector(s => s.accountSlice.lastName);
    const errFields = useAppSelector(s => s.accountSlice.errFields);
    const successMsg = useAppSelector(s => s.accountSlice.successMsg)
    const dispatch = useDispatch<AppDispatch>();

    

    

    function formSubmission(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!user)
            return;

        let isValid = true;
        const newName = nameRef.current?.value;
        const newPass = passRef.current?.value;

        dispatch(resetAccountErrFields());

        if (!newName) {
            dispatch(setAccountErrField({field: 'name', msg: 'O nome do Usuário é obrigatório' }))
            isValid = false;
        }

        if (newPass && !isPassSecure(newPass)) {
            dispatch(setAccountErrField({field: 'pass', msg: 'A senha deve conter 8 ou mais caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial' }))
            isValid = false;
        }

        if (!isValid)
            return;

        if (newName == lastName && !newPass)
            return; // no need to call the database

        dispatch(updateAccountInfo({ id: user.id, newName: newName!, newPass: newPass ?? '', updateUserInfo})).then(() => {
            passRef.current!.value = ''
        });

    }

    useEffect(() => {

        if (!nameRef.current || !emailRef.current)
            return;

        emailRef.current.value = user.email;
        nameRef.current.value = lastName;
    }, [lastName])

    return <section className="flex max-[850px]:flex-col w-[100%]">
        <section className="flex-1">
            <h2 className="text-[1.25em] font-bold mb-[1em]">Minha conta</h2>
            <img src="/Adjustments.svg" alt="Ajustes" className="w-[100%] max-[850px]:hidden" />
        </section>
        <form className="flex-1" onSubmit={(e) => formSubmission(e)}>

            <section className="mb-[1em]">
                <label htmlFor="name">Nome</label>
                <Input ref={nameRef} id="name" type="text" hasError={!!errFields.name} className="w-[100%]"  />
                {errFields.name && <span className="text-red-bytebank">{errFields.name}</span>}
            </section>

            <section className="mb-[1em]">
                <label htmlFor="email">E-mail</label>
                <Input ref={emailRef} id="email" type="text" className="w-[100%]" readOnly />
            </section>

            <section className="mb-[1em]">
                <label htmlFor="pass">Senha</label>
                <Input ref={passRef} id="pass" type="password" className="w-[100%]" />
            </section>

            {successMsg && <div className="text-green-bytebank-dark font-bold my-[1em]">{successMsg}</div>}

            <ButtonSecondary className="mt-[1em]" type="submit">
                Salvar Alterações
            </ButtonSecondary>

            <img src="/Adjustments.svg" alt="Ajustes" className="w-[100%] mt-[1em] min-[851px]:hidden" />
        </form>
    </section>
}