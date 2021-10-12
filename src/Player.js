module.exports = class Player {
  constructor(name, pot, startingAmount = 100) {
    this.name = name;
    this.pot = pot;
    this.amount = startingAmount;
  }
  deposit(amount) {
    this.amount += amount;
  }
  withdraw(amount) {
    if (amount > this.amount) {
      throw Error('Amount withdrawn may not exceed amount in posession');
    }
    this.amount -= amount;
    this.pot.deposit(amount);
  }
}
