

import { ReactNode } from "react"
import { initCapSentence, toMoney } from "../../model/utils/str";
import { useAppSelector } from "../../store/store";



export default function Summary({children} : {
    children: ReactNode
}) {


    const user = useAppSelector(s => s.operationSlice.sessionUser);

    
    return <section className="flex-1">
        <section className="bg-blue-bytebank flex max-[550px]:flex-col justify-between p-[1em] px-[2em] rounded-[.5em] my-[2em] text-white min-h-[20em]">
            <section className="w-[48%] max-[550px]:w-[100%]">
                <h1 className="text-[1.5em] mb-[1em]">Olá, {user?.name?.split(' ')[0]}! :)</h1>
                <p className="text-[.8em]">{initCapSentence(new Date().toLocaleDateString(['pt-br', 'en-us'], { dateStyle: "full" }))}</p>
                <img className="min-[1100px]:hidden max-[550px]:hidden" src="/pig_safe.svg" alt="Seu saldo seguro com a gente"></img>
            </section>
            <section className="w-[48%] max-[550px]:w-[100%] flex flex-col self-center pr-[1em]">
                <h1 className="text-[1.5em] border-b-[.1em] border-red-bytebank py-[.5em]">Saldo</h1>
                <p className="mt-[1em]">Conta Corrente</p>
                <p className="text-[1.5em]">{toMoney(user?.balance ?? 0)}</p>
            </section>
            <img className="min-[550px]:hidden" src="/pig_safe.svg" alt="Seu saldo seguro com a gente"></img>
        </section>
        <section className="flex rounded-[.5em] p-[2em] mb-[2em] bg-grey-bytebank text-black">
            {children}
        </section>        
    </section>
}