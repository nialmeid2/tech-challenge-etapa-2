import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    hasError?: boolean
}


export default function Input({className = '', children, hasError, ...rest} : Props) {
    return <input className={`border-[.1em] ${hasError ? 'border-red-bytebank bg-red-bytebank-light' : 
        `border-green-bytebank-dark ${rest.readOnly || rest.disabled ? 'bg-grey-bytebank' : 'bg-white'}`} p-[.5em] rounded-[.25em] ${className}`} {...rest}>
        {children}        
    </input>
}