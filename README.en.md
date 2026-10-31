# 🛒 Command-Line Shopping Cart

**[中文](README.md) | English**

A simple Node.js command-line shopping cart system. Users browse products, add them to a cart, and check out through a CLI. The core logic is verified with unit tests written using [Vitest](https://vitest.dev/).

## Features

- **Product list**: preset products, each with `id`, name, description, price and available quantity
- **Add to cart**: enter a product ID and quantity to add the item to the cart
- **Cart management**: the cart is an array whose entries contain `productId`, `quantity` and `totalPrice`
- **Checkout**: compute the total, reduce stock and clear the cart
- **Loop interaction**: after each action the system returns to product selection, so multiple items can be added
- **Unit tests**: Vitest is used to verify the core functions and edge cases

## Project Structure

```
shopping-cart/
├── cli.js                # CLI entry point (readline)
├── src/
│   ├── products.js       # Product data and factory function
│   └── cart.js           # Core cart logic (pure functions, easy to test)
├── test/
│   └── cart.test.js      # Vitest unit tests
└── package.json
```

## Requirements

- Node.js 18+
- npm

## Install

```bash
cd "d:\TRAE work\shopping-cart"
npm install
```

## Run

Start the command-line shopping cart:

```bash
npm start
```

Run the unit tests:

```bash
npm test           # single run
npm run test:watch # watch mode
```

## CLI Usage

After startup the system prints the product list and prompts for input:

| Input | Description |
|-------|-------------|
| `productID quantity` | Add a product to the cart, e.g. `1 2` adds 2 units of product ID 1 |
| `cart` | Show the current cart and its total |
| `checkout` | Check out: compute the total, reduce stock and clear the cart |
| `quit` / `exit` | Exit the system |

### Sample Session

> The CLI prints its prompts in Chinese; the output below is shown as-is.

```
🛒 欢迎使用命令行购物车系统

==================== 商品列表 ====================
ID: 1 | 苹果 | ¥5 | 库存: 100 件
   新鲜红富士苹果，每斤
...

> 1 2
✅ 已加入购物车

---------------- 当前购物车 -----------------
苹果 x 2 = ¥10
合计: ¥10
--------------------------------------------

> checkout
✅ 结账成功！应付总额：¥10
```

## Core Function API

The core logic lives in [src/cart.js](src/cart.js). All functions are pure and take the `products` array as an argument, which keeps state isolated for testing:

| Function | Description |
|----------|-------------|
| `findProduct(products, productId)` | Look up a product by ID; returns `undefined` if not found |
| `addToCart(products, cart, productId, quantity)` | Add an item to the cart, merging quantities of the same product and recomputing `totalPrice`; throws on invalid input |
| `calculateTotal(cart)` | Compute the cart total; returns `0` for an empty cart |
| `checkout(products, cart)` | Compute the total, reduce stock, clear the cart and return the total |

Product data lives in [src/products.js](src/products.js), which exports a `createProducts()` factory (fresh state for tests) and a default `products` list.

## Test Coverage

[test/cart.test.js](test/cart.test.js) contains 12 test cases covering:

- Finding an existing product / finding a non-existent product
- Adding a product to the cart (verifying the entry structure)
- Merging repeated adds of the same product and recomputing the price
- Adding a non-existent product (throws)
- Adding more than the available quantity (throws)
- Validating quantities of 0, negative and non-integer values (throws)
- Total calculation for an empty cart
- Total calculation for multiple products
- Checking out an empty cart (throws)
- Checkout flow: total calculation, stock reduction and cart clearing
