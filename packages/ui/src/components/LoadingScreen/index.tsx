"use client"

import { useSelector } from "react-redux"
import { useAppSelector } from "../../store/store"


export default function LoadingScreen() {

    const isLoading = useAppSelector(state => state.loginSlice.isLoading);

    

    return <aside className={`z-[1001] flex items-center justify-center ${isLoading ? 'bg-white/25 fixed left-[0] top-[0] h-[100vh] w-[100vw]' : 'hidden'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-black h-[50vh] animate-spin" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
        </svg>
    </aside>
}