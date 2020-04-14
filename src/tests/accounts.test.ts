import { handleAuthorizeCommand, isAuthorized, getCurrAccountId, unAuthorize } from '../core/accounts'

import { getAccounts, getAccountsAsync } from '../core/repositories/accountsRepository'

jest.mock('../core/repositories/accountsRepository')

describe('Accounts Test', () => {
    beforeAll(() => {
        // need to load the initial accounts csv first...
        getAccountsAsync()
    })

    beforeEach(() => {
        // need to load the initial accounts csv first...
        unAuthorize(getCurrAccountId())
    })

    const authFailedResponseString = 'Authorization failed.'

    it('handleAuthorizationCommand - success case', () => {
        const accountId = '7089382418'
        const response = handleAuthorizeCommand([accountId, '0075'])

        expect(response).toEqual([`${accountId} successfully authorized.`])
        expect(isAuthorized()).toBeTruthy()

        expect(getCurrAccountId()).toBe(accountId)
    })

    it('handleAuthorizationCommand - faliure cases', () => {
        const accountId = '7089382418'

        var response = handleAuthorizeCommand([undefined, '0075'])
        expect(response).toEqual([authFailedResponseString])
        expect(isAuthorized()).toBeFalsy()

        response = handleAuthorizeCommand([undefined, undefined])
        expect(response).toEqual([authFailedResponseString])
        expect(isAuthorized()).toBeFalsy()

        response = handleAuthorizeCommand(['This', 'shouldnt work'])
        expect(response).toEqual([authFailedResponseString])
        expect(isAuthorized()).toBeFalsy()

        response = handleAuthorizeCommand([accountId, 'Neither'])
        expect(response).toEqual([authFailedResponseString])
        expect(isAuthorized()).toBeFalsy()

        response = handleAuthorizeCommand(['should these', '1999'])
        expect(response).toEqual([authFailedResponseString])
        expect(isAuthorized()).toBeFalsy()
    })

    it('handleAuthorizationCommand - success case with unAuthCountdown and unAuthorize', async () => {
        const accountId = '7089382418'

        const response = handleAuthorizeCommand([accountId, '0075'])

        expect(response).toEqual([`${accountId} successfully authorized.`])
        expect(isAuthorized()).toBeTruthy()

        expect(getCurrAccountId()).toBe(accountId)

        setTimeout(() => expect(isAuthorized()).toBeFalsy(), 120001)
    }, 129999)
  })