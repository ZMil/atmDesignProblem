import { getCurrAccountId } from './accounts'
import { getAccounts } from './repositories/accountsRepository'
import { Account } from './Account'

export const getBalance = (): string[] => {
    const accountId = getCurrAccountId()
    const accounts = getAccounts()
    const currAccount:Account = accounts[accountId]
    return [`Current balance: ${currAccount.balance}`]
}