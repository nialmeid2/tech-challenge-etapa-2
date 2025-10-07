
"use client"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return <html>
        <body style={{margin: 0}}>{children}</body>
    </html>
}
