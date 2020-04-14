class ATM {
    availableMoney: number = 10000

    withdraw(money:number) {
        this.availableMoney = this.availableMoney - money
    }

    deposit(money:number) {
        this.availableMoney += money
    }
}

export const atm = new ATM()

