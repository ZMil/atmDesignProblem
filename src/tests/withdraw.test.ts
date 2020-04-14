import { handleAuthorizeCommand, isAuthorized, getCurrAccountId, unAuthorize } from '../core/accounts'
import { getAccountsAsync } from '../core/repositories/accountsRepository'

import { handleWithdrawlCommand } from '../core/withdraw'
import { atm } from '../core/atm'

jest.mock('../core/repositories/accountsRepository')

describe('Withdraw Test', () => {
    const accountId = '2001377812'
    const accountPin = '5950'
    const startingBalance = 60.00
    let currBalance = startingBalance

    const richAccountId = '1434597300'
    const richAccountPin = '4557'
    const richStartingBalance = 90000.55
    let richCurrBalance = richStartingBalance

    beforeAll(() => {
        // need to load the initial accounts csv first...
        getAccountsAsync()
    })

    beforeEach(() => {
        handleAuthorizeCommand([accountId, accountPin])
    })

    it('handleWithdrawlCommand - successful withdrawl', () => {
        const value = 20
        currBalance -= value
        expect(handleWithdrawlCommand([value]))
            .toEqual([`Amount dispensed: $${value}`, `Current balance: ${currBalance}`])
    })

    it('handleWithdrawlCommand - requeted withdrawl not a multiple of 20', () => {
        const value = 50
        expect(handleWithdrawlCommand([value]))
            .toEqual(['Please enter an amount as a multiple of 20.'])
    })

    it('handleWithdrawlCommand - overdrawn after this transaction', () => {
        const value = currBalance + 40
        currBalance = currBalance - value - 5
        expect(handleWithdrawlCommand([value]))
            .toEqual([`Amount dispensed: $${value}`, `You have been charged an overdraft fee of $5. Current balance: ${currBalance}`])
    })

    it('handleWithdrawlCommand - atm has some money, but not requested amount', () => {
        unAuthorize(getCurrAccountId())
        handleAuthorizeCommand([richAccountId, richAccountPin])

        const value = 90000
        const shouldDispense = value - atm.availableMoney
        richCurrBalance -= shouldDispense
        expect(handleWithdrawlCommand([value]))
            .toEqual(
                [
                    `Unable to dispense full amount requested at this time.`,
                    `Amount dispensed: $${shouldDispense}`,
                    `Current balance: ${richCurrBalance}`
                ]
            )

        unAuthorize(getCurrAccountId())
    })

    it('handleWithdrawlCommand - overdrawn before this transaction', () => {
        const value = 20
        currBalance -= value
        expect(handleWithdrawlCommand([value]))
            .toEqual(['Your account is overdrawn! You may not take withdrawals at this time.'])
    })

    it('handleWithdrawlCommand - atm has no money', () => {
        unAuthorize(getCurrAccountId())
        handleAuthorizeCommand([richAccountId, richAccountPin])

        const value = 20
        richCurrBalance -= value
        expect(handleWithdrawlCommand([value]))
            .toEqual(['Unable to process your withdrawl at this time.'])
    })

})