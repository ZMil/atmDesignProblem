import { getCurrAccountId } from './accounts'
import { getAccounts, runThroughTransactionsData } from './repositories/accountsRepository'
import { actionTypeEnums } from './constants/actionTypes'

export const handleHistoryCommand = (): string[] => {
    const currAccountId = getCurrAccountId()
    const accounts = getAccounts()
    const currAccount = accounts[currAccountId]
    const historyItems = currAccount.history

    if(!historyItems || historyItems.length === 0) {
        return ['No history found']
    }
    const results = []
    results.push('[Date and Time] [Transaction Amount] [Balance After Transaction]')

    for(const item of historyItems) {
        const amount = `${item.actionType === actionTypeEnums.WITHDRAW ? '-' : ''}${item.amount}`
        const time = item.time
        const date = new Date(Number(time))
        results.push(`${date.toISOString()} ${amount} ${item.total}`)
    }
    return results
}