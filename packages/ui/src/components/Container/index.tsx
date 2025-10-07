import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
    containerSizeClass?: string
}

export default function Container({containerSizeClass = 'max-w-[75em]', className = '', children, ...rest} : Props) {
    return <div className={`${containerSizeClass} w-[95%] flex justify-between mx-auto ${className}`} {...rest}>
        {children}        
    </div>
}