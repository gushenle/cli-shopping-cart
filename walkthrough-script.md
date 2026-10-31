# Shopping Cart System — Video Walkthrough Script

**Assignment 1B · Code & Test Demonstration**
**Target length:** ~14–16 minutes at normal speed (within the required 10–20 min)

> How to use this script: the paragraphs in plain text are the **spoken script** —
> you can read them aloud while recording. Every `[SCREEN]` line is an action to
> take on screen (scroll, highlight, run a command), not something to say.

---

## Timeline at a glance

| # | Section | What it covers | Approx. time |
|---|---------|----------------|-------------|
| 0 | Introduction | Project purpose & structure | 1.5 min |
| 1 | Most important tests | `test/cart.test.js` | 6.5 min |
| 2 | Application code | `src/cart.js` + `src/products.js` | 6.5 min |
| 3 | Live demo & closing | `npm test` and `npm start` | 2 min |

---

## Part 0 — Introduction (~1.5 min)

`[SCREEN]` Open `test/cart.test.js` and `src/cart.js` side by side in VS Code,
or just have the project folder open so you can switch between files.

Hello. In this video I'll walk through my command-line shopping cart system,
focusing on the two things the assignment asks for: the **unit tests** and the
**application code** that those tests verify.

The program is built with Node.js and tested with **Vitest**. It lets a user
list products, add them to a shopping cart, view the cart, and check out. The
checkout step calculates a total and reduces the stock of each product.

The code is split into three small, focused files so the logic is easy to test:

- `src/products.js` holds the product catalog and a factory function that creates
  fresh products for each test.
- `src/cart.js` contains the pure functions that implement the cart behaviour.
- `test/cart.test.js` contains 12 unit tests covering those functions.

I wrote the tests **before** the implementation, using a test-driven approach.
That's why the functions are shaped the way they are — I will explain that as
we go. Let's start with the tests.

---

## Part 1 — The Most Important Tests (~6.5 min)

### 1.1 Test file structure (~1 min)

`[SCREEN]` Scroll through the top of `test/cart.test.js` — the imports and the
`describe` blocks.

The test file is organised into four `describe` blocks, one per function:
`findProduct`, `addToCart`, `calculateTotal`, and `checkout`. At the top I import
the functions from `src/cart.js` and the `createProducts` factory from
`src/products.js`.

A key detail here is `createProducts`. Every test calls it to get a **fresh**
product array. That guarantees the tests are isolated — one test can reduce
stock during checkout without affecting the next test. This is the first
important design decision, and it is driven by testability.

### 1.2 The core add-to-cart test (~2 min)

`[SCREEN]` Scroll to the first test inside `describe('addToCart')` — the one
titled "adds product as an object with productId, quantity, totalPrice".

Now the most important happy-path test. It verifies that calling
`addToCart(products, cart, 1, 2)` puts exactly one entry into the cart, and that
the entry has the exact shape the assignment requires: `productId`, `quantity`,
and `totalPrice`.

The assertion uses `toEqual` with a full object literal. That's intentionally
strict — I am not just checking "something was added", I am checking the exact
**data contract** of the cart. If a future change renames a property, this test
fails immediately.

### 1.3 Error handling tests (~2 min)

`[SCREEN]` Scroll through the four error tests in the same `addToCart` block.

Good unit tests do not only check the happy path — they check that invalid input
is rejected. Here I test four situations:

1. adding a product that does not exist (`id = 999`) must throw;
2. adding more than the available quantity must throw;
3. adding a quantity of zero or a negative number must throw;
4. adding a non-integer quantity like `1.5` must throw.

Each assertion wraps the call in a function and expects it to `throw`. This is a
common Vitest idiom: `expect(() => addToCart(...)).toThrow()`. It verifies the
function fails **loudly** rather than silently corrupting the cart — which is
exactly what we want for a shopping system, where an invalid order should stop
immediately.

### 1.4 The checkout test — the most important one (~2 min)

`[SCREEN]` Scroll to the last test, inside `describe('checkout')`, titled
"checkout returns total, reduces stock, and clears the cart".

This is the most important test in the file because it covers the whole business
flow in one place. It adds two different products to the cart, records their
original stock, then calls `checkout`. It then asserts **three things**:

1. the returned total equals the expected sum;
2. each product's `quantity` was reduced by the ordered amount;
3. the cart is now empty.

The point of testing all three together is that checkout has side effects. A
function like this cannot be trusted if it only computes the right number — it
must also update stock correctly and reset the cart for the next customer. One
assertion is not enough, so I verify every side effect.

### 1.5 Remaining coverage (~1 min)

`[SCREEN]` Briefly point at the `findProduct` and `calculateTotal` blocks, and
the empty-cart checkout test.

The rest rounds out the suite: `findProduct` returns the right product or
`undefined`; `calculateTotal` returns `0` for an empty cart and the correct sum
for multiple items; and checkout on an **empty cart** throws instead of doing
nothing. Together the 12 tests cover every scenario listed in the assignment,
plus a few edge cases like merging duplicates and rejecting non-integers.

---

## Part 2 — Application Code That Implements These Tests (~6.5 min)

`[SCREEN]` Switch to `src/products.js`, then to `src/cart.js`.

Now let me show the implementation behind each of those tests.

### 2.1 The product factory (`src/products.js`) (~1 min)

`[SCREEN]` Open `src/products.js`.

Each product is an object with `id`, `name`, `description`, `price`, and
`quantity` — exactly the fields the assignment specifies. The important part is
that I did **not** export a single mutable array and reuse it everywhere.
Instead I export a `createProducts()` factory that returns a brand-new array each
time it is called.

Why? Because tests and the CLI need their own copies. If tests shared one global
array, the checkout test that reduces stock would make every later test fail.
The factory gives us isolation for free.

### 2.2 `findProduct` (~0.5 min)

`[SCREEN]` Scroll to `findProduct` in `src/cart.js`.

`findProduct` is a one-liner using `Array.prototype.find` to locate a product by
`id`, and it returns `undefined` when nothing matches. It is deliberately tiny
because it is reused by both `addToCart` and `checkout`. Keeping it as a separate
function also means it can be tested on its own, which is why it has its own
`describe` block.

### 2.3 `addToCart` (~2.5 min)

`[SCREEN]` Scroll to `addToCart`.

This function exists to satisfy four test groups, so its structure maps directly
onto them:

First, it **validates the quantity**. The line
`if (!Number.isInteger(quantity) || quantity <= 0)` guards against zero, negative,
and fractional values — this is what makes the `0`, `-1`, and `1.5` tests pass.

Second, it **checks the product exists** via `findProduct`. If not, it throws —
this is the "nonexistent product" test.

Third, it **checks stock**: if the requested quantity exceeds the available
quantity, it throws. Notice this guard prevents the cart from ever holding more
than we can sell.

Fourth, it either **merges or appends**. If the product is already in the cart,
it increases the quantity and recalculates `totalPrice`. Otherwise it pushes a new
object with `productId`, `quantity`, and `totalPrice = price * quantity`. That is
the exact shape the first test asserts.

The function is a **pure function**: it takes its inputs (`products`, `cart`,
`productId`, `quantity`) as arguments rather than reading a global. It does mutate
the `cart` it is given, which keeps it simple, but because the caller owns the
array, the behaviour stays fully testable.

### 2.4 `calculateTotal` (~0.5 min)

`[SCREEN]` Scroll to `calculateTotal`.

`calculateTotal` reduces the cart, summing each item's `totalPrice`. The `0` at
the end is the initial value, so an empty array correctly returns `0` — which is
exactly what its empty-cart test expects.

### 2.5 `checkout` (~2 min)

`[SCREEN]` Scroll to `checkout`.

`checkout` is the counterpart to the most important test I explained earlier, and
its body follows the same three guarantees:

1. It **rejects an empty cart** by throwing immediately — matching the
   empty-cart test.
2. It **validates and reduces stock** in a loop. For every cart item it finds the
   product, verifies the item is still in stock, and then subtracts the ordered
   quantity. I re-check stock here rather than trusting earlier checks, because
   checkout is a separate, self-contained step.
3. It **computes the total and clears the cart**. It calls `calculateTotal` for
   the amount, sets `cart.length = 0` to empty the array, and returns the total.

This design — small, single-purpose pure functions that throw on invalid input —
is the reason the test suite can be both comprehensive and easy to read. Every
function has a clear, assertable contract.

---

## Part 3 — Live Demo & Closing (~2 min)

`[SCREEN]` Switch to the integrated terminal in the project folder.

Let me run the tests to confirm everything passes. I'll type `npm test`.

`[SCREEN]` Run `npm test` and show the summary: `Test Files 1 passed`, `Tests 12 passed`.

As you can see, all 12 tests pass.

Finally, let me run the application itself with `npm start`, add a product, view
the cart, and check out, so you can see how the tested functions come together in
the CLI.

`[SCREEN]` Run `npm start`. Type `1 2`, then `cart`, then `checkout`, then `quit`.

The program lists the products, accepts a product id and quantity, shows the
running total in the cart, and at checkout prints the total and reduces stock —
exactly the behaviour my tests guarantee.

To sum up: I wrote the tests first to define each function's contract, then
implemented four small pure functions to satisfy them, and kept the products in a
factory so every test runs in isolation. That is the approach and the design
behind this assignment. Thank you.

---

## Quick reference (for recording)

| Command / action | What it shows |
|------------------|---------------|
| `npm test` | all 12 Vitest tests pass |
| `npm start` | run the CLI |
| `1 2` then `cart` | add product 1 ×2 and view cart |
| `checkout` | total + stock reduction |
| `quit` | exit |