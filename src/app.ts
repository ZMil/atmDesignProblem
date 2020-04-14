'use strict'
import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import readline from 'readline'

import {
    handleAuthorizeCommand,
    unAuthorize,
    isAuthorized
} from './core/authorize'

import {
    getBalance as handleBalanceCommand
} from './core/balance'

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Zach Milrod\'s ATM', { horizontalLayout: 'full' })
  )
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'ATM> '
});

rl.prompt();

rl.on('line', (line) => {
    const splitLineArray = line.split(' ')
    const command = splitLineArray[0]
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
    }

    switch (command) {
        case 'authorize':
            handleAuthorizeCommand(splitLineArray)
            break;
        case 'withdraw':

            break;
        case 'deposit':

            break;
        case 'balance':
            handleBalanceCommand()
            break;
        case 'history':
        
            break;
        case 'logout':
            
            break;
        case 'end':
            process.exit(0);
        default:
            console.log(`Say what? I might have heard '${line.trim()}'`);
            break;
    }
    rl.prompt();
}).on('close', () => {
    process.exit(0);
});
