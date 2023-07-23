const ShoppingCart = require('./shoppingCart');

describe('ShoppingCart', () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  test('should add items to the cart', () => {
    cart.addItem({ name: 'Product 1', price: 10 });
    cart.addItem({ name: 'Product 2', price: 20 });
    
    expect(cart.items).toHaveLength(2);
  });

  test('should remove item from the cart', () => {
    cart.addItem({ name: 'Product 1', price: 10 });
    cart.addItem({ name: 'Product 2', price: 20 });
    cart.addItem({ name: 'Product 3', price: 30 });

    cart.removeItem(1); // Remove the second item

    expect(cart.items).toHaveLength(2);
    expect(cart.items[0].name).toBe('Product 1');
    expect(cart.items[1].name).toBe('Product 3');
  });

  test('should calculate the total price', () => {
    cart.addItem({ name: 'Product 1', price: 10 });
    cart.addItem({ name: 'Product 2', price: 20 });
    cart.addItem({ name: 'Product 3', price: 30 });

    const totalPrice = cart.getTotalPrice();

    expect(totalPrice).toBe(60);
  });

  test('should clear all items of cart', () => {
    cart.addItem({ name: 'Product 1', price: 10 });
    cart.addItem({ name: 'Product 2', price: 20 });
    cart.clearCart();

    expect(cart.items).toHaveLength(0);
  })
});
