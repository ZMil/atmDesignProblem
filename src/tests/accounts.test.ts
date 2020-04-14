import { handleAuthorizeCommand, isAuthorized, getCurrAccountId, unAuthorize } from '../core/accounts'

import { getAccountsAsync } from '../core/repositories/accountsRepository'

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
        unAuthorize(getCurrAccountId())
    })

    const authFailedResponseString = 'Authorization failed.'

    it('handleAuthorizationCommand - success case', () => {
        const response = handleAuthorizeCommand([accountId, accountPin])

        expect(response).toEqual([`${accountId} successfully authorized.`])
        expect(isAuthorized()).toBeTruthy()

        expect(getCurrAccountId()).toBe(accountId)
    })

    it('handleAuthorizationCommand - faliure cases', () => {
        let response = handleAuthorizeCommand([undefined, accountPin])
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
        const response = handleAuthorizeCommand([accountId, accountPin])

        expect(response).toEqual([`${accountId} successfully authorized.`])
        expect(isAuthorized()).toBeTruthy()

        expect(getCurrAccountId()).toBe(accountId)

        setTimeout(() => { expect(isAuthorized()).toBeFalsy() }, 120001)
    }, 129999)
  })