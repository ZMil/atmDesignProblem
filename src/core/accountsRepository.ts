import csv from 'csv-parser'
import fs from 'fs'

import { Account } from './Account'

const accounts = {}

const readInCsv = () => new Promise((resolve, reject) => {
    const promises = [];
    fs.createReadStream('./data/accounts.csv')
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
            resolve();
        });
})

export const getAccounts = async() => {
    if(Object.entries(accounts).length === 0) {
        await readInCsv()
    }

    return accounts
}
