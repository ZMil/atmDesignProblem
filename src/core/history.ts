import { getCurrAccountId } from './accounts'
import { getAccounts } from './repositories/accountsRepository'
import { actionTypeEnums } from './constants/actionTypes'

export const handleHistoryCommand = () => {
    const currAccountId = getCurrAccountId()
    const currAccount = getAccounts()[currAccountId]
    const historyItems = currAccount.history
    if(!historyItems) {
        return ['No history found']
    }
    const results = []

    results.push('[Date and Time] [Transaction Amount] [Balance After Transaction]')
    for(const item of historyItems) {
        const amount = `${item.ACTION_TYPE === actionTypeEnums.WITHDRAW ? '-' : ''}${item.AMOUNT}`
        results.push(`${(new Date(Number(item.TIME))).toISOString()} ${amount} ${item.TOTAL}`)
    }
}