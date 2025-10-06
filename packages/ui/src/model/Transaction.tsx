

import db from "../db/db";
import { User } from "../generated/prisma";
import { AdditiveTransactions, SubtractiveTransactions, transactionsPerPage, TransactionTypes } from "./enums/Transaction";
import { InvestmentTypes } from "./Investment";


export interface Transaction {
    id: number;
    type: TransactionTypes;
    value: number;
    createdAt: Date;
    attachment: string | null | undefined;
    userId: number;
}


function addDays(date: Date, days: number) {
    const result = new Date(date); // Create a copy to avoid modifying the original
    result.setDate(result.getDate() + days);
    return result;
}

export async function getStatement(userId: number, daysBehind: number, maximumOperations = transactionsPerPage) {
    "use server"

    try {

        const transactions = await db.transaction.findMany({
            take: maximumOperations,
            where: { userId: userId, /* createdAt: { gte: addDays(new Date(), -1 * Math.abs(daysBehind))}*/ },
            orderBy: { createdAt: 'desc' }
        })

        await db.$disconnect();

        return transactions as Transaction[];

    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getGraphData(userId: number, maximumOperations = transactionsPerPage * 3) {
    "use server"

    try {

        const expenses = SubtractiveTransactions.filter((s) => !InvestmentTypes.some((i) => s == i));
        const revenue = AdditiveTransactions.filter((a) => a != TransactionTypes.INTEREST);
        const investments = InvestmentTypes.filter((i) => i != TransactionTypes.INTEREST);
        const investmentsProfit = [TransactionTypes.INTEREST];


        const operationTypes: Record<string, TransactionTypes[]> = {
            "Investimentos": investments,
            "Renda": revenue,
            "Gastos": expenses,
            "Renda de investimentos": investmentsProfit
        };

        const graphData = {
            labels: [] as string[],
            datasets: [{
                label: '',
                data: [] as number[],
                backgroundColor: [] as string[],
                hoverOffset: 4
            }]
        }

        graphData.datasets[0]!.backgroundColor = [
            '#004D61',
            '#47a138',
            '#ff5031',
            '#e4ede3'
        ]


        for (let opType in operationTypes) {

            const theArray = operationTypes[opType]!;

            const transactionsOfType = await db.transaction.aggregate({
                take: maximumOperations,
                where: { userId: userId, type: { in: theArray } },
                orderBy: { createdAt: 'asc' },
                _sum: { value: true },
            })

            graphData.labels.push(opType);
            graphData.datasets[0]!.label = 'Total'
            graphData.datasets[0]!.data.push(transactionsOfType._sum.value ?? 0);        
        }

        await db.$disconnect();

        return graphData;

    } catch (err) {
        console.log(err);
        throw err;
    }

}

export async function getFilteredTransactions(userId: number, date: Date | undefined, transactionType: TransactionTypes | undefined, page = 1) {
    "use server"

    try {



        if (!date && !transactionType) return [];

        let where;
        if (!transactionType)
            where = { createdAt: { gte: date }, userId: userId };
        if (!date)
            where = { type: transactionType, userId: userId }
        if (date && transactionType)
            where = { createdAt: { gte: date }, type: transactionType, userId: userId }

        const transactions = await db.transaction.findMany({
            where,
            skip: (page - 1) * transactionsPerPage,
            take: transactionsPerPage,
            orderBy: { createdAt: 'desc' }
        })

        await db.$disconnect();

        return transactions;

    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function addAdditiveOperation(user: User, transaction: Omit<Transaction, "id">) {
    "use server"
    if (!AdditiveTransactions.includes(transaction.type))
        return false;

    const newBalance = user.balance + transaction.value; // since it's additive, the user's balance increases
    transaction.userId = user.id;
    transaction.createdAt = new Date()

    try {

        const newTransaction = await db.transaction.create({
            data: transaction
        });

        await db.user.update({
            where: { id: user.id },
            data: { balance: newBalance }
        });

        await db.$disconnect();

        return newTransaction;

    } catch (err) {
        console.log(err);
        throw err;
    }
}


export async function addSubtractiveOperation(user: User, transaction: Omit<Transaction, "id">) {
    "use server"
    if (!SubtractiveTransactions.includes(transaction.type))
        return false;

    if (user.balance < transaction.value)
        return false;

    const newBalance = user.balance - transaction.value; // since it's substrative, the user's balance decreases
    transaction.userId = user.id;
    transaction.createdAt = new Date()

    try {

        const newTransaction = await db.transaction.create({
            data: transaction
        });

        await db.user.update({
            where: { id: user.id },
            data: { balance: newBalance }
        })

        await db.$disconnect();

        return newTransaction;

    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function removeATransaction(transactionId: number) {
    "use server"

    try {

        const prevTransaction = await db.transaction.findFirst({
            where: { id: transactionId }
        });

        if (!prevTransaction) { await db.$disconnect(); return 'Transação não existe'; }

        const theUser = await db.user.findUnique({
            where: { id: prevTransaction.userId }
        })

        if (!theUser) { await db.$disconnect(); return 'Usuário não existe' }

        if (AdditiveTransactions.includes(prevTransaction.type as TransactionTypes)) {

            const newBalance = theUser.balance - prevTransaction.value

            if (newBalance < 0) {
                await db.$disconnect();
                return "Não há saldo o suficiente para remover a transação";
            }

            await db.user.update({
                where: { id: prevTransaction.userId },
                data: { balance: newBalance }
            })

        } else if (SubtractiveTransactions.includes(prevTransaction.type as TransactionTypes)) {

            const newBalance = theUser.balance + prevTransaction.value; // reimburse the money

            await db.user.update({
                where: { id: prevTransaction.userId },
                data: { balance: newBalance }
            })

        } else {
            await db.$disconnect();
            return 'Transação Inválida'
        }

        await db.transaction.delete({
            where: { id: transactionId }
        })

        await db.$disconnect();
        return '';

    } catch (err) {
        console.log(err);
        throw err;
    }

}


export async function editATransaction(id: number, value: number) {
    "use server"

    try {

        const prevTransaction = await db.transaction.findFirst({
            where: { id }
        });

        if (!prevTransaction) { await db.$disconnect(); return 'Transação não existente'; }

        const theUser = await db.user.findUnique({
            where: { id: prevTransaction.userId }
        })

        if (!theUser) { await db.$disconnect(); return 'Usuário não existente' }

        if (AdditiveTransactions.includes(prevTransaction.type as TransactionTypes)) {

            const difference = prevTransaction.value - value;

            const newBalance = theUser.balance - difference; // 3500 to a 3000 additive transaction results in a 500 gain

            if (newBalance < 0) {
                await db.$disconnect();
                return `A edição está inválida por um total de ${Math.abs(newBalance)}. O saldo resultante não deve ficar menor que 0`;
            }

            await db.user.update({
                where: { id: prevTransaction.userId },
                data: { balance: newBalance }
            })

        } else if (SubtractiveTransactions.includes(prevTransaction.type as TransactionTypes)) {

            const difference = prevTransaction.value - value;
            const newBalance = theUser.balance + difference; // 2500 to a 3000 subtractive transaction will result in a 500 gain

            if (newBalance < 0) {
                await db.$disconnect();
                return `A edição está inválida por um total de ${Math.abs(newBalance)}. O saldo resultante não deve ficar menor que 0`;
            }

            await db.user.update({
                where: { id: prevTransaction.userId },
                data: { balance: newBalance }
            })

        } else {
            await db.$disconnect();
            return 'Transação Inválida'
        }

        await db.transaction.update({
            where: { id },
            data: { value }
        })

        await db.$disconnect();
        return '';
    } catch (err) {
        console.log(err);
        throw err;
    }

}