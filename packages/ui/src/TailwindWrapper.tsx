

export default function TailwindWrapper() {
    // This will cause a hydration error, but some styles will only be properly rendered if the client has to fetch some extra styles. 
    // Fully hydrated server side style won`t render properly
    return <head>
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