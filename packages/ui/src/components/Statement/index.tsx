import { useEffect } from "react";
import { SubtractiveTransactions, transactionsPerPage, TransactionTypes } from "../../model/enums/Transaction"
import { Transaction } from "../../model/Transaction"
import { initCapSentence, toMoney } from "../../model/utils/str"
import { AppDispatch, useAppSelector } from "../../store/store"
import { useDispatch } from "react-redux";
import { getUserStatement } from "../../store/reducers/OperationsReducer";
import BarChart from "../ChartRender/BarChart";
import PieChart from "../ChartRender/PieChart";
import DoughnutChart from "../ChartRender/DoughnutChart";




export default function Statement({ loadPageInfo }: {
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
        graphData: {
            labels: string[];
            datasets: {
                label: string;
                data: number[];
                backgroundColor: string[];
                hoverOffset: number;
            }[];
        };
    }>
}) {

    const statement = useAppSelector(s => s.operationSlice.statetement);
    const graphData = useAppSelector(s => s.operationSlice.graphData);

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(getUserStatement({ loadPageInfo }));
    }, []);

    return <section className="min-[1100px]:w-[25%] bg-grey-bytebank-light mb-[2em] min-[1100px]:my-[2em] min-[1100px]:ml-[2ch] p-[1em] rounded-[.5em] text-black">
        <section className="max-[1100px]:max-w-[25em] mx-auto">
            <h2 className="font-bold text-[1.25em]">Extrato</h2>
        </section>
        <ul className="mx-auto max-[1100px]:max-w-[25em]">
            {statement?.map((stmt) => (<section key={`stmt-${stmt.id}`} className="my-[1em]">
                <p className="text-green-bytebank-dark font-bold">{initCapSentence(new Date().toLocaleDateString(['pt-br', 'en-us'], { month: 'long' }))}</p>
                <p className="flex justify-between items-center gap-[1ch]">
                    <span>{stmt.type}</span>
                    <span className="text-grey-bytebank-dark text-[.8em]">{new Date(stmt.createdAt).toLocaleDateString(['pt-br', 'en-us'], { dateStyle: 'short' })}</span>
                </p>
                <p className="font-bold">{SubtractiveTransactions.includes(stmt.type as TransactionTypes) ? '-' : ''}{toMoney(stmt.value)}</p>
            </section>
            ))}
        </ul>
        { graphData && 
            <section className="py-[1em]">
                <PieChart
                    data={graphData}                    
                />

                <span className="text-center mt-[1em] block text-[.8em]">Baseado nas últimas {transactionsPerPage * 3} transações</span>

            </section>
        }
    </section>
}