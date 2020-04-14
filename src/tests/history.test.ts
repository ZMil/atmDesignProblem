import { handleHistoryCommand } from '../core/history'
import { handleAuthorizeCommand } from '../core/accounts'
import { getAccountsAsync, getAccounts } from '../core/repositories/accountsRepository'
import { handleDepositCommand } from '../core/deposit'
import { handleWithdrawlCommand } from '../core/withdraw'

jest.mock('../core/repositories/accountsRepository')

describe('Accounts Test', () => {
    const accountId = '7089382418'
    const accountPin = '0075'
    beforeAll(() => {
        // need to load the initial accounts csv first...
        getAccountsAsync()
    })

    beforeEach(() => {
        // need to load the initial accounts csv first...
        handleAuthorizeCommand([accountId, accountPin])
    })

    it('handleHistoryCommand - no history', () => {
        expect(handleHistoryCommand()).toEqual(['No history found'])
    })

    const historyResults = ['[Date and Time] [Transaction Amount] [Balance After Transaction]']
    it('handleHistoryCommand - one deposit and one withdrawl', () => {
        expect(handleHistoryCommand()).toEqual(['No history found'])

        const depositAmount = 700
        const afterDepositBalance = getAccounts()[accountId].balance + depositAmount
        handleDepositCommand([depositAmount])

        let currAccount =  getAccounts()[accountId]
        let time = currAccount.history[0].time
        let date = new Date(Number(time))
        historyResults.push(`${date.toISOString()} ${depositAmount} ${afterDepositBalance}`)

        expect(handleHistoryCommand()).toEqual(historyResults)

        const withdrawAmount = 40
        const afterWithdrawBalance = getAccounts()[accountId].balance - withdrawAmount
        handleWithdrawlCommand([withdrawAmount])

        currAccount =  getAccounts()[accountId]
        time = currAccount.history[1].time
        date = new Date(Number(time))
        historyResults.push(`${date.toISOString()} -${withdrawAmount} ${afterWithdrawBalance}`)

        expect(handleHistoryCommand()).toEqual(historyResults)
    })
})