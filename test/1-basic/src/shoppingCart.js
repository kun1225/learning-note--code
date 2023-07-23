class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemIndex) {
    this.items.splice(itemIndex, 1);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  clearCart() {
    this.items = [];
  }
}

module.exports = ShoppingCart;
