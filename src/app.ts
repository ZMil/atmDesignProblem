'use strict'
import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import readline from 'readline'

import {
    handleAuthorizeCommand,
    isAuthorized
} from './core/accounts'

import {
    getBalance as handleBalanceCommand
} from './core/balance'
import { handleWithdrawlCommand } from './core/withdraw'
import { handleDepositCommand } from './core/deposit'
import { handleLogout } from './core/logout'
import { handleHistoryCommand } from './core/history'
import { getAccountsAsync } from './core/repositories/accountsRepository'

getAccountsAsync()
clear()

console.log(
  chalk.yellow(
    figlet.textSync('Zach Milrod\'s ATM', { horizontalLayout: 'full' })
  )
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
  prompt: 'ATM> '
});

rl.prompt();

rl.on('line', (line) => {
    const splitLineArray = line.split(' ')
    const command = splitLineArray[0].toLocaleLowerCase()
    // shift removes 1st element, "shifts" array over one
    splitLineArray.shift()
    if(
        command !== 'authorize' &&
        command !== 'logout' &&
        command !== 'end' &&
        !isAuthorized()
    ) {
        console.log('Authorization required.')
        rl.prompt()
        return
    }

    let printResponses: string[] = []

    switch (command) {
        case 'authorize':
            printResponses = handleAuthorizeCommand(splitLineArray)
            break;
        case 'withdraw':
            printResponses = handleWithdrawlCommand(splitLineArray)
            break;
        case 'deposit':
            printResponses = handleDepositCommand(splitLineArray)
            break;
        case 'balance':
            printResponses = handleBalanceCommand()
            break;
        case 'history':
            printResponses = handleHistoryCommand()
            break;
        case 'logout':
            printResponses = handleLogout()
            break;
        case 'end':
            process.exit(0);
        default:
            printResponses.push(`Sorry, '${line.trim()}' is not a valid command`)
            break;
    }
    for(const response of printResponses) {
        console.log(response)
    }
    rl.prompt();
}).on('close', () => {
    process.exit(0);
});
