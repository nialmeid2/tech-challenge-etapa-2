import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {

}

export default function ButtonSecondary({className, children, ...rest} : Props) {
    return <button className={`py-[.75em] px-[1.5em] cursor-pointer hover:underline text-center bg-red-bytebank-dark border-[.15em] border-red-bytebank-dark text-white rounded-[.25em] ${className}`} {...rest}>
        {children}        
    </button>
}