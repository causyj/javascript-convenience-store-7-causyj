import { Console } from '@woowacourse/mission-utils';
import readFile from '../utils/fileUtils.js';

class ProductService {
  constructor() {
    this.products = this.loadProducts();
  }

  loadProducts() {
    const data = readFile('products.md');
    const lines = data
      .split('\n')
      .slice(1)
      .filter((line) => line.trim() !== '');
    return lines.map((line) => {
      const [name, price, quantity, promotion] = line.split(',');

      return this.print({ name, price, quantity, promotion });
    });
  }

  print({ name, price, quantity, promotion }) {
    Console.print(
      `name : ${name}, price : ${price}, quantity : ${quantity}, promotion  : ${promotion}`,
    );
  }

  getAllProducts() {
    return this.products;
  }
}
export default ProductService;
