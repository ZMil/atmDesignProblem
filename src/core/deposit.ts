import { getBalance } from './balance'
import { getAccounts } from './repositories/accountsRepository'
import { getCurrAccountId, updateAccount } from './accounts'
import { writeDataToCsv } from './repositories/transactionsRepository'

import {actionTypeEnums} from './constants/actionTypes'

import { atm } from './atm'

export const handleDepositCommand = (args): string[] => {
    const depositAmount = args[0]

    const accounts = getAccounts()
    const currAccount = accounts[getCurrAccountId()]
    atm.deposit(depositAmount)
    currAccount.balance += depositAmount
    writeDataToCsv([
        {
            time: Date.now(),
            accountId: currAccount.accountId,
            actionType: actionTypeEnums.DEPOSIT,
            amount: depositAmount,
            total: currAccount.balance
        }
    ])
    updateAccount(currAccount)
    return getBalance()
}