import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";


export default function ButtonPrimaryOutlined({className, children, ...rest} : DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <button className={`py-[.75em] px-[1.5em] cursor-pointer hover:underline text-center border-[.15em] border-green-bytebank bg-transparent text-green-bytebank rounded-[.25em] ${className}`} {...rest}>
        {children}        
    </button>
}