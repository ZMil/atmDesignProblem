import { handleAuthorizeCommand, isAuthorized, getCurrAccountId, unAuthorize } from '../core/accounts'
import { handleLogout } from '../core/logout'
import { getAccountsAsync } from '../core/repositories/accountsRepository'

jest.mock('../core/repositories/accountsRepository')

describe('Logout Test', () => {
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

    it('handleLogout - log in and then out', () => {
        const response = handleAuthorizeCommand([accountId, accountPin])

        expect(response).toEqual([`${accountId} successfully authorized.`])
        expect(isAuthorized()).toBeTruthy()
        expect(getCurrAccountId()).toBe(accountId)

        const logoutResponse = handleLogout()

        expect(logoutResponse).toEqual([`Account ${accountId} logged out.`])
        expect(isAuthorized()).toBeFalsy()
    })

    it('handleLogout - log out without logging in', () => {
        const logoutResponse = handleLogout()

        expect(logoutResponse).toEqual([`No account is currently authorized.`])
        expect(isAuthorized()).toBeFalsy()
    })

})