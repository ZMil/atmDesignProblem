import csv from 'csv-parser'
import fs from 'fs'

import { actionTypeEnums } from '../constants/actionTypes'
import { Account } from '../Account'
import { atm } from '../atm'

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
            const updatedAccount: Account = accounts[row.ACCOUNT_ID]
            if(row.ACTION_TYPE === actionTypeEnums.WITHDRAW) {
                updatedAccount.balance = updatedAccount.balance - row.AMOUNT
            } else if(row.ACTION_TYPE === actionTypeEnums.DEPOSIT) {
                updatedAccount.balance = updatedAccount.balance + row.AMOUNT
                atm.deposit(row.AMOUNT)
            }
            if(!updatedAccount.history) {
                updatedAccount.history = [row]
            } else {
                updatedAccount.history.push(row)
            }
            accounts[row.ACCOUNT_ID] = updatedAccount
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

// export const getAccounts = () => {
//     return accounts
// }

