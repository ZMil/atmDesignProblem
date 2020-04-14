import { getAccounts } from './repositories/accountsRepository'
import { Account } from './Account'

let currAccountId
let currTimerId
let authorizedAccounts: string[] = []
let accounts: {} = getAccounts()

const authFailedResponseString = 'Authorization failed.'

export const handleAuthorizeCommand = (commandArgs: string[]): string[] => {
    const accountId = commandArgs[0]
    const pin = commandArgs[1]
    if(!accountId || !pin) {
        return [authFailedResponseString]
    }

    const possibleAccount = accounts[accountId]
    if(!possibleAccount) {
        return [authFailedResponseString]
    }
    if(possibleAccount.pin === pin) {
        authorizedAccounts.push(accountId)
        currAccountId = accountId
        unAuthCountdown()
        return [`${accountId} successfully authorized.`]
    } else {
        return [authFailedResponseString]
    }
}

export const isAuthorized = (): boolean => {
    const possibleAccount = authorizedAccounts.filter(x => x === currAccountId)
    if(possibleAccount.length > 0) {
        // isAuthorized is called any time a user tries to do anything so makes
        // sense to start the countdown here!
        unAuthCountdown()
    }
    return possibleAccount.length > 0
}

const unAuthCountdown = () => {
    if(currTimerId) {
        clearTimeout(currTimerId)
    }
    if(currAccountId) {
        currTimerId = setTimeout(() => unAuthorize(currAccountId), 120000)
    }
}

export const unAuthorize = (accountId) => {
    console.log(`${currAccountId} unauthed due to inactivity`)
    authorizedAccounts = authorizedAccounts.filter(x => x === accountId)
    currAccountId = ''
}

export const getCurrAccountId = (): string => {
    return currAccountId
}

export const updateAccount = (appt: Account) => {
    accounts[appt.accountId] = appt
}
