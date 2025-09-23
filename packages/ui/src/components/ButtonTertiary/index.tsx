import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";


export default function ButtonTertiary({className = '', children, ...rest} : DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <button className={`py-[.75em] px-[1.5em] cursor-pointer hover:underline text-center bg-blue-bytebank border-[.15em] border-blue-bytebank text-white rounded-[.25em] ${className}`} {...rest}>
        {children}        
    </button>
}