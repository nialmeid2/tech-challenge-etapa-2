"use client"

import { useEffect } from "react";

export default function Page() {
    
    useEffect(() => {
        location.href = '/home';
    }, []);

    return <p style={{color: 'white', backgroundColor: '#333', margin: 0, display: 'flex', fontSize: '10em', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh'}}>
        <span>
            Loading...
        </span>
    </p>;
}