import readFile from '../utils/fileUtils.js';
import Products from '../models/Products.js';

class ProductService {
  constructor() {
    this.products = this.#loadProducts();
  }

  #isPromotionActive(promotion) {
    if (promotion.trim() === 'null') {
      return '';
    }
    return promotion.trim();
  }

  #loadProducts() {
    const data = readFile('products.md');
    const lines = data
      .split('\n')
      .slice(1)
      .filter((line) => line.trim() !== '');
    return lines.map((line) => {
      const [name, price, quantity, promotion] = line.split(',');
      const formattedPromotion = this.#isPromotionActive(promotion);
      return new Products(name, price, quantity, formattedPromotion);
    });
  }

  getAllProducts() {
    return this.products;
  }
}
export default ProductService;
