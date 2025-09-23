import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

interface Props extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    hasError?: boolean
}

export default function Select({className = '', children, hasError, ...rest} : Props) {
    return <select className={`border-[.1em] ${hasError ? 'border-red-bytebank bg-red-bytebank-light' : 'border-green-bytebank-dark bg-white'} border-green-bytebank-dark p-[.5em] rounded-[.25em] w-[100%] ${className}`} {...rest}>
        {children}        
    </select>
}