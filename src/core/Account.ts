export class Account {
    accountId: string;
    pin: string;
    balance: number;
    history: {}[] = [];

    constructor(
        accountId: string,
        pin: string,
        balance: number
    ) {
        this.accountId = accountId
        this.pin = pin
        this.balance = balance
    }
}