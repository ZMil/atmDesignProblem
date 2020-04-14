import csv from 'csv-parser'
import fs from 'fs'

import { actionTypeEnums } from '../constants/actionTypes'
import { Account } from '../Account'
import { atm } from '../atm'

import { createObjectCsvWriter } from 'csv-writer'

const accounts = {}

const readInInitialAccountsData = () => new Promise((resolve, reject) => {
    const promises = [];
    console.log('asg')
    fs.createReadStream('./data/initialAccountsData.csv')
        .pipe(csv())
        .on('data', (row) => {
            accounts[row.ACCOUNT_ID] = new Account(
                row.ACCOUNT_ID,
                row.PIN,
                row.BALANCE
            )
        })
        .on("error", reject)
        .on('end', async () => {
            await Promise.all(promises);
            console.log('accounts', accounts)
            resolve();
        });
})

export const runThroughTransactionsData = () => new Promise((resolve, reject) => {
    const promises = [];
    fs.createReadStream('./data/transactions.csv')
        .pipe(csv())
        .on('data', (row) => {
            console.log(row)
            const updatedAccount: Account = accounts[row.accountId]
            if(row.actionType === actionTypeEnums.WITHDRAW) {
                updatedAccount.balance = updatedAccount.balance - row.amount
            } else if(row.actionType === actionTypeEnums.DEPOSIT) {
                updatedAccount.balance = updatedAccount.balance + row.amount
                atm.deposit(row.amount)
            }
            if(!updatedAccount.history) {
                updatedAccount.history = [row]
            } else {
                updatedAccount.history.push(row)
            }
            accounts[row.accountId] = updatedAccount
        })
        .on("error", reject)
        .on('end', async () => {
            await Promise.all(promises);
            resolve();
        });
})

export const getAccountsAsync = async(): Promise<{}> => {
    if(!accounts || Object.entries(accounts).length === 0) {
        await readInInitialAccountsData()
        await runThroughTransactionsData()
        return new Promise(resolve => accounts)
    }

    return new Promise(resolve => accounts)
}

export const getAccounts = (): {} => {
    return accounts
}


const csvWriter = createObjectCsvWriter({
    path: 'data/transactions.csv',
    header: [
        {id: 'TIME', title: 'time'},
        {id: 'ACCOUNT_ID', title: 'accountId'},
        {id: 'ACTION_TYPE', title: 'actionType'},
        {id: 'AMOUNT', title: 'amount'},
        {id: 'TOTAL', title: 'total'}
    ]
})

export const writeDataToTransactionsCsv = (data) => {
    csvWriter.writeRecords(data)
}

