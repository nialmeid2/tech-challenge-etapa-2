"use client"

import { useEffect, useState } from "react"

export default function TailwindWrapper() {

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient)
        return <head>
            <script>
                @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto+Slab:wght@100..900&display=swap');
            </script>
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>

    // This will cause a hydration error, but some styles will only be properly rendered if the client has to fetch some extra styles. 
    // Fully hydrated server side style won`t render properly
    return <head>
        <script>
            @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto+Slab:wght@100..900&display=swap');
        </script>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style type="text/tailwindcss">
            {`                
                @custom-variant dark (&:where(.dark, .dark *));

                @theme {
                    --color-green-bytebank: #47a138;
                    --color-green-bytebank-dark: #2b6222;
                    --color-green-bytebank-light: #e4ede3;
                    --color-blue-bytebank: #004D61;
                    --color-grey-bytebank: #cbcbcb;
                    --color-grey-bytebank-dark: #505658;
                    --color-grey-bytebank-light: #f5f5f5;
                    --color-gray-bytebank: #cbcbcb;
                    --color-gray-bytebank-dark: #505658;
                    --color-gray-bytebank-light: #f5f5f5;
                    --color-red-bytebank: #ff5031;
                    --color-red-bytebank-dark: #ad1a00;
                    --color-red-bytebank-light: #ffd8d1;
                }
            `}
        </style>
    </head>
}