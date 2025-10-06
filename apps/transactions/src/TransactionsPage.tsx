"use client"



import ButtonTertiary from "@repo/ui/components/ButtonTertiary/index";
import Input from "@repo/ui/components/Input/index";
import Select from "@repo/ui/components/Select/index";
import { getTransactionOptions, SubtractiveTransactions, TransactionTypes } from "@repo/ui/model/enums/Transaction";
import { Transaction } from "@repo/ui/model/Transaction";
import { toMoney } from "@repo/ui/model/utils/str.ts";
import { AppDispatch, useAppSelector } from "@repo/ui/store/store";
import { addFilters, editTransaction, loadNextPage, removeTransactionById } from "@repo/ui/store/reducers/OperationsReducer"

import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ButtonPrimary from "@repo/ui/components/ButtonPrimary/index";
import { LoadedPageInfo } from "@repo/ui/serverActions/index";



export default function TransactionsPage({ filterTransactions, removeTransaction, loadPageInfo, editTheTransaction }: {
    filterTransactions: (userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page: number) => Promise<Transaction[]>,
    removeTransaction: (transactionId: number) => Promise<string>,
    editTheTransaction(transactionId: number, value: number): Promise<string>
    loadPageInfo: () => LoadedPageInfo
}) {

    const dateRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const editRef = useRef<HTMLInputElement>(null);

    const user = useAppSelector(s => s.operationSlice.sessionUser);
    const transactions = useAppSelector(s => s.operationSlice.transactions);
    const lastFilters = useAppSelector(s => s.operationSlice.filterOptions.lastFilters);
    const currPage = useAppSelector(s => s.operationSlice.filterOptions.currPage);
    const alreadyEnded = useAppSelector(s => s.operationSlice.filterOptions.alreadyEnded);
    const errList = useAppSelector(s => s.operationSlice.errList);

    const [fullImg, setFullImg] = useState<Record<number, boolean>>({});
    const [editingId, setEditingId] = useState(0);


    const dispatch = useDispatch<AppDispatch>();

    function submitFilter(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const theDate = dateRef.current?.value ? new Date(dateRef.current.value) : undefined;
        const theType = typeRef.current?.value ?? undefined;

        if (!theDate && !theType) return;

        dispatch(addFilters({ filterTransactions, lastFilters: { date: theDate, type: theType as TransactionTypes | undefined }, user: { ...user, createdAt: new Date(user.createdAt) } }))
    }

    function callNextPage() {

        const theUser = { ...user, createdAt: new Date(user.createdAt) }
        const theFilters = { ...lastFilters, date: lastFilters.date ? new Date(lastFilters.date) : undefined }

        dispatch(loadNextPage({ currPage, lastFilters: theFilters, user: theUser, filterTransactions }));


    }

    function removeTheTransaction(removeId: number) {
        dispatch(removeTransactionById({ id: removeId, removeTransaction, loadPageInfo }));
    }

    function startEditing(editId: number) {
        setEditingId(editId);
    }

    function uploadEdit(e: FormEvent<HTMLFormElement>, editId: number) {
        e.preventDefault();

        if (!editRef.current?.value || +editRef.current.value <= 0) {
            setEditingId(0);
            return; // cancel the editing
        }

        setEditingId(0);
        dispatch(editTransaction({ editTheTransaction, transactionId: editId, transactionValue: +editRef.current.value, loadPageInfo }))

    }

    useEffect(() => {
        if (!transactions)
            return;

        const newFullImgs: Record<number, boolean> = {};
        const transactionsWithAttachment = transactions.filter((t) => !!t.attachment)

        for (let i = 0; i < transactionsWithAttachment.length; i++) {
            newFullImgs[transactionsWithAttachment[i].id] = false;
        }

        setFullImg(newFullImgs);

    }, [transactions])

    return <section className="flex flex-col">
        <form onSubmit={(e) => submitFilter(e)}>
            <section className="flex justify-between gap-[2ch] max-[635px]:flex-col">
                <div className="gap-[1em] flex items-center">
                    <label htmlFor="date">Início</label>
                    <Input ref={dateRef} id="date" type="date"></Input>
                </div>
                <div className="gap-[1em] flex items-center">
                    <label htmlFor="type">Tipo</label>
                    <Select ref={typeRef} id="type">{getTransactionOptions()}</Select>
                </div>
                <div className="flex items-center">
                    <ButtonPrimary type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-[1em]" viewBox="0 0 16 16" aria-label="Filtrar">
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                        </svg>
                    </ButtonPrimary>
                </div>
            </section>
        </form>
        <section className="flex flex-col my-[1em]">
            {transactions.map((t) => <section key={`transaction-${t.id}`} className="my-[1em] flex items-center gap-[1ch]">
                <section className="flex-1">
                    <div className="text-green-bytebank-dark">{t.type}</div>
                    {
                        editingId == 0 || editingId != t.id ?
                            <div className="font-bold">{SubtractiveTransactions.includes(t.type as TransactionTypes) ? '-' : ''}{toMoney(t.value)}</div>
                            : <form onSubmit={(e) => uploadEdit(e, t.id)}>
                                <Input ref={editRef} type="number" min={0} step={0.01} defaultValue={t.value} className="mb-[1ch]"/>
                                <ButtonTertiary type="submit" className="ml-[1ch] max-[500px]:ml-[0] max-[500px]:mb-[1ch] max-[500px]:block">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-[.8em]" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                                    </svg>
                                </ButtonTertiary>
                            </form>
                    }
                    <div>{new Date(t.createdAt).toLocaleString(['pt-br', 'en-us'], { dateStyle: 'short', timeStyle: 'medium' })}</div>
                    {t.attachment ? <img src={t.attachment} alt="comprovante da transação"
                        className={`${!fullImg[t.id] ? 'w-[10ch] transition-all duration-300' : 'w-[100%] transition-all duration-300'} cursor-pointer`}
                        onClick={() => setFullImg((fi) => ({ ...fi, [t.id]: !fi[t.id] }))} /> : <></>}
                    {errList[t.id] ? <div className="text-red-bytebank-dark font-bold">{errList[t.id]}</div> : <></>}
                </section>
                <section className="flex flex-col gap-[1em] justify-evenly">
                    <ButtonTertiary onClick={() => removeTheTransaction(t.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-[.8em]" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </ButtonTertiary>
                    <ButtonPrimary onClick={() => startEditing(t.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-[.8em]" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                        </svg>
                    </ButtonPrimary>
                </section>
            </section>)}
            {transactions.length > 0 && !alreadyEnded ? <ButtonTertiary className="mt-[1em]" onClick={() => callNextPage()}>Mostrar Mais</ButtonTertiary> : <></>}
        </section>
    </section>
}

