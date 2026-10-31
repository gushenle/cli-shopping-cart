import { describe, it, expect } from 'vitest';
import {
  findProduct,
  addToCart,
  calculateTotal,
  checkout,
} from '../src/cart.js';
import { createProducts } from '../src/products.js';

describe('findProduct', () => {
  it('应返回指定 id 的商品', () => {
    const products = createProducts();
    const product = findProduct(products, 1);
    expect(product).toBeDefined();
    expect(product.id).toBe(1);
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('quantity');
  });

  it('找不到商品时应返回 undefined', () => {
    const products = createProducts();
    expect(findProduct(products, 999)).toBeUndefined();
  });
});

describe('addToCart', () => {
  it('应把商品以对象形式加入购物车，含 productId、quantity、totalPrice', () => {
    const products = createProducts();
    const cart = [];

    addToCart(products, cart, 1, 2);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual({
      productId: 1,
      quantity: 2,
      totalPrice: products[0].price * 2,
    });
  });

  it('再次加入同一商品时应合并数量并重新计算 totalPrice', () => {
    const products = createProducts();
    const cart = [];
    const price = products[0].price;

    addToCart(products, cart, 1, 2);
    addToCart(products, cart, 1, 3);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(5);
    expect(cart[0].totalPrice).toBe(price * 5);
  });

  it('加入不存在的商品应抛出错误', () => {
    const products = createProducts();
    const cart = [];

    expect(() => addToCart(products, cart, 999, 1)).toThrow();
  });

  it('加入超过可用数量的商品应抛出错误', () => {
    const products = createProducts();
    const cart = [];
    const product = products[0];

    expect(() => addToCart(products, cart, product.id, product.quantity + 1)).toThrow();
  });

  it('加入数量为 0 或负数应抛出错误', () => {
    const products = createProducts();
    const cart = [];

    expect(() => addToCart(products, cart, 1, 0)).toThrow();
    expect(() => addToCart(products, cart, 1, -1)).toThrow();
  });

  it('加入非整数数量应抛出错误', () => {
    const products = createProducts();
    const cart = [];

    expect(() => addToCart(products, cart, 1, 1.5)).toThrow();
  });
});

describe('calculateTotal', () => {
  it('空购物车总价应为 0', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('应正确计算多件商品的总价', () => {
    const products = createProducts();
    const cart = [];
    addToCart(products, cart, 1, 2);
    addToCart(products, cart, 2, 3);

    const expected = products[0].price * 2 + products[1].price * 3;
    expect(calculateTotal(cart)).toBe(expected);
  });
});

describe('checkout', () => {
  it('空车结账应抛出错误', () => {
    const products = createProducts();
    const cart = [];

    expect(() => checkout(products, cart)).toThrow();
  });

  it('结账应返回总价、减少库存并清空购物车', () => {
    const products = createProducts();
    const cart = [];
    const product1 = products[0];
    const product2 = products[1];
    const originQty1 = product1.quantity;
    const originQty2 = product2.quantity;

    addToCart(products, cart, product1.id, 2);
    addToCart(products, cart, product2.id, 3);

    const expectedTotal = product1.price * 2 + product2.price * 3;
    const total = checkout(products, cart);

    expect(total).toBe(expectedTotal);
    // 库存减少
    expect(product1.quantity).toBe(originQty1 - 2);
    expect(product2.quantity).toBe(originQty2 - 3);
    // 购物车清空
    expect(cart).toHaveLength(0);
  });
});