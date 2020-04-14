import { Account } from "../../Account"

// const accountsRepository: any = jest.genMockFromModule('../accountsRepository');

const accounts = {
'1434597300':
    new Account (
        '1434597300',
        '4557',
        90000.55
    ),
'2001377812':
    new Account (
        '2001377812',
        '5950',
        60.00
    ),
'2859459814':
    new Account (
        '2859459814',
        '7386',
        10.24
    ),
'7089382418':
    new Account (
        '7089382418',
        '0075',
        0.00
    )
}

export const getAccountsAsync = async(): Promise<{}> => {
    return new Promise(resolve => accounts)
}

export const getAccounts = (): {} => {
    return accounts
}

