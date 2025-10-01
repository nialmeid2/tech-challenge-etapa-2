"use client"


import ButtonTertiary from "@repo/ui/components/ButtonTertiary/index";
import Input from "@repo/ui/components/Input/index";
import Select from "@repo/ui/components/Select/index";
import { AdditiveTransactions, getTransactionOptions, SubtractiveTransactions, TransactionTypes } from "@repo/ui/model/enums/Transaction";
import { Transaction } from "@repo/ui/model/Transaction";
import { User } from "@repo/ui/model/User";
import { resetLoginErrMessages } from "@repo/ui/store/reducers/LoginReducer";
import { addErrField, createOperation, getUserStatement } from "@repo/ui/store/reducers/OperationsReducer";
import { AppDispatch, useAppSelector } from "@repo/ui/store/store";
import { FormEvent, useRef } from "react"
import { useDispatch } from "react-redux";

export default function OperationsPage({ createAdditiveOperation, createSubtractiveOperation, loadPageInfo }: {
    createAdditiveOperation: (user: User, transaction: Omit<Transaction, "id">) => Promise<void>,
    createSubtractiveOperation: (user: User, transaction: Omit<Transaction, "id">) => Promise<void>,
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
}) {

    const valueRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const errFields = useAppSelector(s => s.operationSlice.errFields);

    const dispatch = useDispatch<AppDispatch>();
    const user = useAppSelector(s => s.operationSlice.sessionUser);



    function submitOperation(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!user)
            return;

        valueRef.current!.value = valueRef.current!.value.replaceAll(/[^\d]/g, '');
        const formattedValue = +valueRef.current!.value;
        const transactionType = typeRef.current?.value;
        let isValid = true;

        dispatch(resetLoginErrMessages())

        if (isNaN(formattedValue) || formattedValue <= 0) {
            dispatch(addErrField({ field: 'value', value: 'Valor inválido. Digite um número maior que 0' }));
            isValid = false;
        }
        if (!transactionType) {
            dispatch(addErrField({ field: 'transactionType', value: 'Selecione um tipo de transação' }));
            isValid = false;
        }

        if (!isValid)
            return;


        const transactionObject = {
            userId: user.id,
            type: transactionType as TransactionTypes,
            value: formattedValue,
            createdAt: new Date()
        } as Omit<Transaction, "id">;

        const normalUser = { ...user, createdAt: new Date(user.createdAt) } as User;

        if (AdditiveTransactions.includes(transactionType as TransactionTypes)) {

            dispatch(createOperation({ user: normalUser, transaction: transactionObject, createATransactionOperation: createAdditiveOperation, loadPageInfo }));

            valueRef.current!.value = "";
            typeRef.current!.value = "";            
            return;
        }
        if (SubtractiveTransactions.includes(transactionType as TransactionTypes)) {
            if (user.balance < formattedValue) {
                addErrField({ field: 'value', value: `Não há saldo o suficiente para concluir a operação de ${transactionType}` })
                return;
            }

            dispatch(createOperation({ user: normalUser, transaction: transactionObject, createATransactionOperation: createSubtractiveOperation, loadPageInfo }));
            
            valueRef.current!.value = "";
            typeRef.current!.value = "";
            return;
        }
        else {
            addErrField({ field: 'transactionType', value: "Transação inválida" });
            return;
        }


    }

    return <form className="flex flex-col w-[100%]" onSubmit={(e) => submitOperation(e)}>

        <h2 className="text-[1.25em] font-bold mb-[1em]">Nova Transação</h2>

        <div className="flex flex-col">
            <Select ref={typeRef} hasError={!!errFields.transactionType}>
                {getTransactionOptions()}
            </Select>
            {errFields.transactionType && <span className="text-red-bytebank-dark font-bold">{errFields.transactionType}</span>}
        </div>

        <div className="my-[2em] flex flex-col">
            <label htmlFor={'value'}>Valor</label>
            <Input id="value" type="number" min={0} step={0.01} hasError={!!errFields.value}
                ref={valueRef} />
            {errFields.value && <span className="text-red-bytebank-dark font-bold">{errFields.value}</span>}
        </div>

        <ButtonTertiary type="submit" className="">
            Concluir Transação
        </ButtonTertiary>

    </form>
}