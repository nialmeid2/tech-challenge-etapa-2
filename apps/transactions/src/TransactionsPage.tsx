"use client"



import ButtonTertiary from "@repo/ui/components/ButtonTertiary/index";
import Input from "@repo/ui/components/Input/index";
import Select from "@repo/ui/components/Select/index";
import { getTransactionOptions, SubtractiveTransactions, TransactionTypes } from "@repo/ui/model/enums/Transaction";
import { Transaction } from "@repo/ui/model/Transaction";
import { toMoney } from "@repo/ui/model/utils/str.ts";
import { AppDispatch, useAppSelector } from "@repo/ui/store/store";
import { addFilters, loadNextPage, removeTransactionById } from "@repo/ui/store/reducers/OperationsReducer"

import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ButtonPrimary from "@repo/ui/components/ButtonPrimary/index";
import { LoadedPageInfo } from "@repo/ui/serverActions/index";



export default function TransactionsPage({ filterTransactions, removeTransaction, loadPageInfo }: {
    filterTransactions: (userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page: number) => Promise<Transaction[]>,
    removeTransaction: (transactionId: number) => Promise<string>,
    loadPageInfo: () => LoadedPageInfo
}) {

    const dateRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    
    const user = useAppSelector(s => s.operationSlice.sessionUser);
    const transactions = useAppSelector(s => s.operationSlice.transactions);
    const lastFilters = useAppSelector(s => s.operationSlice.filterOptions.lastFilters);
    const currPage = useAppSelector(s => s.operationSlice.filterOptions.currPage);
    const alreadyEnded = useAppSelector(s => s.operationSlice.filterOptions.alreadyEnded);
    const errList = useAppSelector(s => s.operationSlice.errList);

    const [fullImg, setFullImg] = useState<Record<number, boolean>>({});


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
                    <div className="font-bold">{SubtractiveTransactions.includes(t.type as TransactionTypes) ? '-' : ''}{toMoney(t.value)}</div>
                    <div>{new Date(t.createdAt).toLocaleString(['pt-br', 'en-us'], { dateStyle: 'short', timeStyle: 'medium' })}</div>
                    {t.attachment ? <img src={t.attachment} alt="comprovante da transação" 
                        className={`${!fullImg[t.id] ? 'w-[10ch] transition-all duration-300' : 'w-[100%] transition-all duration-300'}`} 
                        onClick={() => setFullImg((fi) => ({...fi, [t.id]: !fi[t.id]}))}/> : <></>}
                    {errList[t.id] ? <div className="text-red-bytebank-dark font-bold">{errList[t.id]}</div> : <></>}
                </section>
                <section>
                    <ButtonPrimary onClick={() => removeTheTransaction(t.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-[1em]" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </ButtonPrimary>
                </section>
            </section>)}
            {transactions.length > 0 && !alreadyEnded ? <ButtonTertiary className="mt-[1em]" onClick={() => callNextPage()}>Mostrar Mais</ButtonTertiary> : <></>}
        </section>
    </section>
}

