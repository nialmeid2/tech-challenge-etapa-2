import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TailwindWrapper from "@repo/ui/TailwindWrapper";


const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Byte Bank",
    description: "Experimente mais liberdade no controle da sua vida financeira",
    icons: '/logo.svg'
};


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    

    return (
        <html lang="en">
            <TailwindWrapper />
            <body
                className={`${inter.className} bg-[#333] text-white antialiased min-w-screen min-h-screen overflow-x-hidden flex`}
            >
                {children}
            </body>
        </html>
    );
}
