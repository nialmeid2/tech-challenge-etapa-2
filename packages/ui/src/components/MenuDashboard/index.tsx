"use client"

import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/reducers/LoginReducer";
import { AppDispatch, useAppSelector } from "../../store/store";
import { closeMenu } from "../../store/reducers/OperationsReducer";
import { useEffect, useState } from "react";


export default function MenuDashboard({clearLoggedUser} : {
    clearLoggedUser: () => Promise<void>        
}) {

    const [pathName, setPathName] = useState('');
    const isMenuOpen = useAppSelector(s => s.operationSlice.isMenuOpen)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setPathName(location.pathname);
    }, [])
    
    
    const linkStyle = (active: boolean) => `py-[1em] w-[100%] text-center block ${active ? 
            'max-[550px]:text-red-bytebank-dark text-green-bytebank border-green-bytebank font-bold border-b-[.2em]' : 
            'border-black min-[1100px]:border-b-[.1em] max-[550px]:border-b-[.1em]'}`

    return <>
        <nav className={"min-[1100px]:bg-grey-bytebank-light max-[550px]:bg-grey-bytebank-light text-black min-[1100px]:w-[15%] rounded-[.5em] min-[1100px]:my-[2em] min-[1100px]:mr-[2ch] " +
            `max-[550px]:fixed max-[550px]:z-[100] max-[550px]:min-w-[15em] max-[550px]:w-[40%] max-[550px]:top-[0] max-[550px]:rounded-[0] max-[550px]:pb-[1em] ${
                isMenuOpen ? 'max-[550px]:left-[0]' : 'max-[550px]:left-[-100vw]'}`
        }>

            <button className="absolute cursor-pointer top-[1em] right-[1em] min-[550px]:hidden" onClick={() => { dispatch(closeMenu()) }}>
                <img src="/x.svg" alt="fechar" className="h-[1em]" />
            </button>

            <ul className="flex min-[1100px]:flex-col max-[550px]:flex-col max-[1100px]:justify-between p-[1em] px-[1.5em]">
                <li>
                    <a href="/dashboard" className={linkStyle(pathName?.toLowerCase() == '/dashboard')}>Início</a>
                </li>
                <li>
                    <a href="/transactions" className={linkStyle(pathName?.toLowerCase() == '/transactions')}>Transações</a>
                </li>
                <li>
                    <a href="/investments" className={linkStyle(pathName?.toLowerCase() == '/investments')}>Investimentos</a>
                </li>
                <li>
                    <a href="/account" className={linkStyle(pathName?.toLowerCase() == '/account')}>Outros Serviços</a>
                </li>
                <li className="min-[550px]:hidden min-[1100px]:block">
                    <a href="/" onClick={() => dispatch(logoutUser({clearLoggedUser}))} className={linkStyle(false)}>Encerrar Sessão</a>
                </li>
            </ul>
        </nav>
        <button className={`fixed left-[0] top-[0] w-[100vw] h-[100vh] bg-black/50 z-[98] ${isMenuOpen ? '' : 'hidden'}`}
            onClick={() => { dispatch(closeMenu()); }}>
        </button>
    </>
}