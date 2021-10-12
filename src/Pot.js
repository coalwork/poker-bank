module.exports = class Pot {
  constructor() {
    this.name = '__pot';
    this.amount = 0;
  }
  deposit(amount) {
    this.amount += amount;
  }
  withdraw(amount, player) {
    if (amount > this.amount) {
      throw RangeError('Amount withdrawn may not exceed amount in pot');
    }
    this.amount -= amount;
    player.deposit(amount);
  }
  clear() {
    this.amount = 0;
  }
};

