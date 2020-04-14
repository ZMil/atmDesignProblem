import { getBalance } from './balance'
import { getAccounts } from './repositories/accountsRepository'
import { getCurrAccountId, updateAccount } from './accounts'
import { writeDataToCsv } from './repositories/transactionsRepository'

import {actionTypeEnums} from './constants/actionTypes'

import { atm } from './atm'

export const handleWithdrawlCommand = (args) => {
    let valueDesired = args[0]
    if(valueDesired % 20 !== 0) {
        return ['Please enter an amount as a multiple of 20.']
    }

    const accounts = getAccounts()
    const currAccount = accounts[getCurrAccountId()]
    let currBalance = currAccount.balance
    if(currBalance < 0) {
        return ['Your account is overdrawn! You may not take withdrawals at this time.']
    }

    if(atm.availableMoney <= 0) {
        return ['Unable to process your withdrawl at this time.']
    }

    const results = []

    if(atm.availableMoney < valueDesired) {
        valueDesired = valueDesired - atm.availableMoney
        results.push('Unable to dispense full amount requested at this time.')
    }

    if(currBalance - valueDesired < 0) {
        currBalance -= 5
    }
    currBalance -= valueDesired

    currAccount.balance = currBalance
    updateAccount(currAccount)
    atm.withdraw(valueDesired)

    writeDataToCsv([
        {
            time: Date.now(),
            accountId: currAccount.accountId,
            actionType: actionTypeEnums.WITHDRAW,
            amount: valueDesired,
            total: currAccount.balance - valueDesired
        }
    ])

    results.push(`Amount dispensed: ${valueDesired}`)
    if(currBalance < 0){
        results.push(`You have been charged an overdraft fee of $5. ${getBalance()[0]}`)
    } else {
        results.push(getBalance()[0])
    }
    return results
}