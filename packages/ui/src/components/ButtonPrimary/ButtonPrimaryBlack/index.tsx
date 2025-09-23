import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";


export default function ButtonPrimaryBlack({className, children, ...rest} : DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <button className={`py-[.75em] px-[1.5em] cursor-pointer hover:underline text-center bg-black border-[.15em] border-black text-white rounded-[.25em] ${className}`} {...rest}>
        {children}        
    </button>
}