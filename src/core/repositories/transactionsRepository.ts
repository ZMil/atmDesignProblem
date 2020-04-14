import csv from 'csv-parser'
import fs from 'fs'

import { createObjectCsvWriter } from 'csv-writer'

const csvWriter = createObjectCsvWriter({
    path: 'data/transactions.csv',
    header: [
        {id: 'time', title: 'TIME'},
        {id: 'accountId', title: 'ACCOUNT_ID'},
        {id: 'actionType', title: 'ACTION_TYPE'},
        {id: 'amount', title: 'AMOUNT'},
        {id: 'total', title: 'TOTAL'}
    ]
})

export const writeDataToCsv = (data) => {
    csvWriter.writeRecords(data)
}
