/**
 * 购物车核心逻辑（纯函数，方便单元测试）。
 * 所有函数都接收商品数组 products 作为参数，便于在测试中使用独立状态。
 */

// 根据 id 查找商品，找不到返回 undefined
export function findProduct(products, productId) {
  return products.find((product) => product.id === productId);
}

/**
 * 将商品加入购物车。
 * - 会修改传入的 cart 数组（追加或合并条目）。
 * - 同名商品重复添加时合并数量并重算 totalPrice。
 * - 返回购物车数组本身，方便链式调用。
 */
export function addToCart(products, cart, productId, quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('数量必须是正整数');
  }

  const product = findProduct(products, productId);
  if (!product) {
    throw new Error(`商品不存在：id = ${productId}`);
  }

  if (quantity > product.quantity) {
    throw new Error(`库存不足：${product.name} 仅剩 ${product.quantity} 件`);
  }

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
    existing.totalPrice = product.price * existing.quantity;
  } else {
    cart.push({
      productId,
      quantity,
      totalPrice: product.price * quantity,
    });
  }

  return cart;
}

// 计算购物车中所有商品的总价
export function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.totalPrice, 0);
}

/**
 * 结账：计算总价、减少每种商品的可用数量并清空购物车。
 * 返回本次结账的总价。
 */
export function checkout(products, cart) {
  if (cart.length === 0) {
    throw new Error('购物车为空，无法结账');
  }

  for (const item of cart) {
    const product = findProduct(products, item.productId);
    if (!product || item.quantity > product.quantity) {
      throw new Error(`库存不足，无法完成结账：商品 id = ${item.productId}`);
    }
    product.quantity -= item.quantity;
  }

  const total = calculateTotal(cart);
  cart.length = 0;
  return total;
}