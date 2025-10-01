"use client"

import Container from "@repo/ui/components/Container/index";
import HeaderDashboard from "@repo/ui/components/Header/index";
import LoadingScreen from "@repo/ui/components/LoadingScreen/index";
import MenuDashboard from "@repo/ui/components/MenuDashboard/index";
import Statement from "@repo/ui/components/Statement/index";
import Summary from "@repo/ui/components/Summary/index";
import { Transaction } from "@repo/ui/model/Transaction"
import { ReactNode } from "react";


export default function Dashboard({ clearLoggedUser, loadPageInfo, children }: {
    clearLoggedUser: () => Promise<void>,
    loadPageInfo: () => Promise<{
        statement: Transaction[];
        loggedUser: {
            password: string;
            id: number;
            name: string;
            email: string;
            balance: number;
            createdAt: Date;
        };
    }>,
    children: ReactNode
}) {


    return <div className="flex-1 flex flex-col">
        <HeaderDashboard clearLoggedUser={clearLoggedUser} />

        <main className="flex-1 bg-green-bytebank-light">
            <Container className="flex max-[1100px]:flex-col">
                <MenuDashboard clearLoggedUser={clearLoggedUser} />
                <Summary>
                    {children}
                </Summary>
                <Statement loadPageInfo={loadPageInfo}/>
            </Container>
        </main>

        <LoadingScreen />

    </div>
}