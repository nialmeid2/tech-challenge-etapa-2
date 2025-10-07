import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";


export default function ButtonPrimaryOutlinedBlack({className, children, ...rest} : ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button className={`py-[.75em] px-[1.5em] cursor-pointer hover:underline text-center border-[.15em] border-black bg-transparent text-black rounded-[.25em] ${className}`} {...rest}>
        {children}        
    </button>
}