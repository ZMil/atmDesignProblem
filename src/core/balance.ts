import { getCurrAccountId } from './authorize'
import { getAccounts } from './accountsRepository'
import { Account } from './Account'

export const getBalance = () => {
    const accountId = getCurrAccountId()
    getAccounts()
        .then(accounts => {
            const currAccount:Account = accounts[accountId]
            console.log(`Current balance: ${currAccount.balance}`)
        })
}