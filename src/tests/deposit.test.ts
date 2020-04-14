import { handleDepositCommand } from '../core/deposit'
import { handleAuthorizeCommand } from '../core/accounts'
import { getAccounts, getAccountsAsync } from '../core/repositories/accountsRepository'

jest.mock('../core/repositories/accountsRepository')

describe('Deposit Tests', () => {
    const accountId = '7089382418'
    handleAuthorizeCommand([accountId, '0075'])

    it('handleDepositCommand', () => {
        const beforeBalance = getAccounts()[accountId].balance
        expect(handleDepositCommand([700])).toEqual([`Current balance: ${beforeBalance + 700}`])
    })
  })