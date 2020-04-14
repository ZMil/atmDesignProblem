import { getAccounts } from './accountsRepository'
import { Account } from './Account'
import { isBoolean } from 'util'

var currAccountId
var currTimerId
var authorizedAccounts: Account[] = []


export const handleAuthorizeCommand = (commandArgs) => {
    const accountId = commandArgs[0]
    const pin = commandArgs[1]
    if(!accountId || !pin) {
        console.log('Authorization failed.')
        return ''
    }

    getAccounts()
        .then(accounts => {
            const possibleAccount = accounts[accountId]
            if(!possibleAccount) {
                console.log('Authorization failed.')
            }

            if(possibleAccount.pin === pin) {
                authorizedAccounts.push(accountId)
                currAccountId = accountId
                console.log(`${accountId} successfully authorized.`)
                unAuthCountdown()
            } else {
                console.log('Authorization failed.')
            }
        })
}


export const isAuthorized = (): boolean => {
    const possibleAccount = authorizedAccounts.filter(x => x !== currAccountId)
    if(possibleAccount) {
        // isAuthorized is called any time a user tries to do anything so makes
        // sense to start the countdown here!
        unAuthCountdown()
    }
    return Boolean(possibleAccount)
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
    authorizedAccounts = authorizedAccounts.filter(x => x.accountId === accountId)
    currAccountId = ''
}

export const getCurrAccountId = () => {
    return currAccountId
}
