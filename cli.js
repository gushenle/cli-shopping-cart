import readline from 'node:readline';
import { products } from './src/products.js';
import {
  addToCart,
  calculateTotal,
  checkout,
} from './src/cart.js';

const cart = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showProducts() {
  console.log('\n==================== 商品列表 ====================');
  for (const p of products) {
    const stock = p.quantity > 0 ? `${p.quantity} 件` : '已售罄';
    console.log(
      `ID: ${p.id} | ${p.name} | ¥${p.price} | 库存: ${stock}\n   ${p.description}`
    );
  }
  console.log('==================================================');
}

function showCart() {
  console.log('\n---------------- 当前购物车 -----------------');
  if (cart.length === 0) {
    console.log('（空）');
  } else {
    for (const item of cart) {
      const product = products.find((p) => p.id === item.productId);
      console.log(
        `${product.name} x ${item.quantity} = ¥${item.totalPrice}`
      );
    }
    console.log(`合计: ¥${calculateTotal(cart)}`);
  }
  console.log('--------------------------------------------');
}

function prompt() {
  console.log(
    '\n请输入操作：\n' +
      '  - 直接输入「商品ID 数量」加入购物车，例如：1 2\n' +
      '  - 输入 checkout 结账\n' +
      '  - 输入 cart 查看购物车\n' +
      '  - 输入 quit 退出\n'
  );
  rl.question('> ', (answer) => {
    const input = answer.trim();

    if (input === 'quit' || input === 'exit') {
      console.log('再见！');
      rl.close();
      return;
    }

    if (input === 'checkout') {
      try {
        const total = checkout(products, cart);
        console.log(`\n✅ 结账成功！应付总额：¥${total}`);
      } catch (err) {
        console.log(`\n❌ ${err.message}`);
      }
      // 结账后继续回到商品选择（除非购物车已清空，仍继续循环）
      loop();
      return;
    }

    if (input === 'cart') {
      showCart();
      loop();
      return;
    }

    const parts = input.split(/\s+/);
    if (parts.length === 2) {
      const productId = Number(parts[0]);
      const quantity = Number(parts[1]);
      if (Number.isInteger(productId) && Number.isInteger(quantity)) {
        try {
          addToCart(products, cart, productId, quantity);
          console.log('✅ 已加入购物车');
          showCart();
        } catch (err) {
          console.log(`❌ ${err.message}`);
        }
        loop();
        return;
      }
    }

    console.log('❌ 输入格式无效，请重新输入');
    loop();
  });
}

function loop() {
  showProducts();
  prompt();
}

console.log('🛒 欢迎使用命令行购物车系统');
loop();