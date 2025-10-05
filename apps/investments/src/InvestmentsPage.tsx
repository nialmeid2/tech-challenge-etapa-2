"use client"

import DoughnutChart from '@repo/ui/components/ChartRender/DoughnutChart'
import { AdditiveTransactions, InvestmentTransactions, TransactionTypes } from "@repo/ui/model/enums/Transaction";
import { initCapSentence, toMoney } from "@repo/ui/model/utils/str.ts";
import { loadUserInvestments } from "@repo/ui/store/reducers/InvestmentsReducer";
import { AppDispatch, useAppSelector } from "@repo/ui/store/store";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type InvestmentData = { qtty: number; total: number; };

export default function InvestmentsPage({ getInvestmentsReport }: {
    getInvestmentsReport: (userId: number) => Promise<Record<InvestmentTransactions, InvestmentData>>    
}) {

        
    const user = useAppSelector(s => s.operationSlice.sessionUser);
    const investments = useAppSelector(s => s.invesmentsSlice.investments);
    const graphData = useAppSelector(s => s.invesmentsSlice.investmentGraph);
    const total = useAppSelector(s => s.invesmentsSlice.total);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!user) return;

        dispatch(loadUserInvestments({getInvestmentsReport, user}));

        
    }, [user])

    return <section className="flex flex-col w-[100%]">
        <h2 className="text-[1.5em] font-bold mb-[1em]">Investimentos</h2>
        {graphData && <section className="p-[1em]">
            <DoughnutChart data={graphData}/>
        </section>}
        <p className="text-blue-bytebank text-[1.25em] mb-[1em]">Total: {toMoney(total)}</p>        
        <section className="grid grid-cols-2 max-[550px]:grid-cols-1 gap-[1em]">
            {investments && Object.keys(investments).map((inv) => <section key={`type-${inv}`}
                className={`${AdditiveTransactions.includes(inv as TransactionTypes) ? 'bg-green-bytebank-dark' : 'bg-blue-bytebank'} text-white text-center flex flex-col rounded-[.5em] p-[1em]`}>
                <section>
                    {initCapSentence(inv.replace(/Investimento em\s+/gi, ''))}
                </section>
                <section className="mt-[.5em] text-[1.15em] font-bold">
                    {toMoney(investments[inv as InvestmentTransactions].total ?? 0)}
                </section>
            </section>)}
        </section>
    </section>
}