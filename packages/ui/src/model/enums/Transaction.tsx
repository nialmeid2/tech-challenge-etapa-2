export enum TransactionTypes {
    DEPOSIT = 'Depósito',
    INCOME = "Renda",
    WITHDRAW = 'Saque',
    TRANSFER = 'Transferência',
    INVESTIMENT_FUNDS = 'Investimento em fundos',
    DIRECT_TREASURY = 'Investimento em Tesouro Direto',
    PRIVATE_RETIREMENT = 'Investimento em Previdência Privada',
    STOCKS = 'Investimento em Bolsa de Valores',
    INTEREST = "Rendimentos de Investimentos"
}

export const AdditiveTransactions = [TransactionTypes.DEPOSIT, TransactionTypes.INCOME, TransactionTypes.INTEREST]

export const SubstrativeTransactions = [
    TransactionTypes.WITHDRAW, TransactionTypes.TRANSFER, TransactionTypes.INVESTIMENT_FUNDS, TransactionTypes.DIRECT_TREASURY,
    TransactionTypes.PRIVATE_RETIREMENT, TransactionTypes.STOCKS
]

export type InvestmentTransactions =
    TransactionTypes.INVESTIMENT_FUNDS | TransactionTypes.DIRECT_TREASURY | TransactionTypes.PRIVATE_RETIREMENT | TransactionTypes.STOCKS | TransactionTypes.INTEREST


export function getTransactionOptions() {
    return <>
        <option value="">Selecione o tipo de transação</option>
        <option value={TransactionTypes.DEPOSIT}>{TransactionTypes.DEPOSIT}</option>
        <option value={TransactionTypes.INCOME}>{TransactionTypes.INCOME}</option>
        <option value={TransactionTypes.WITHDRAW}>{TransactionTypes.WITHDRAW}</option>
        <option value={TransactionTypes.TRANSFER}>{TransactionTypes.TRANSFER}</option>
        <option value={TransactionTypes.INVESTIMENT_FUNDS}>{TransactionTypes.INVESTIMENT_FUNDS}</option>
        <option value={TransactionTypes.DIRECT_TREASURY}>{TransactionTypes.DIRECT_TREASURY}</option>
        <option value={TransactionTypes.PRIVATE_RETIREMENT}>{TransactionTypes.PRIVATE_RETIREMENT}</option>
        <option value={TransactionTypes.STOCKS}>{TransactionTypes.STOCKS}</option>
        <option value={TransactionTypes.INTEREST}>{TransactionTypes.INTEREST}</option>
    </>
}

export const transactionsPerPage = 10;