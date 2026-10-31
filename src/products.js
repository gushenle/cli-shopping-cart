// 商品数据：每个商品包含 id、名称、描述、价格和可用数量
export function createProducts() {
  return [
    { id: 1, name: '苹果', description: '新鲜红富士苹果，每斤', price: 5, quantity: 100 },
    { id: 2, name: '香蕉', description: '进口香蕉，每把', price: 8, quantity: 50 },
    { id: 3, name: '牛奶', description: '全脂纯牛奶 1L 装', price: 12, quantity: 30 },
    { id: 4, name: '面包', description: '全麦面包 400g', price: 15, quantity: 20 },
    { id: 5, name: '鸡蛋', description: '散养土鸡蛋 10 枚装', price: 18, quantity: 40 },
  ];
}

// 供命令行界面使用的商品列表
export const products = createProducts();