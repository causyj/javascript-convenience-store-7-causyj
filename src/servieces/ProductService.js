import readFile from '../utils/fileUtils.js';
import Products from '../models/Products.js';
import FileContentsValidator from '../validators/FileContentsValidator.js';

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

  #validateProductAttributes(name, price, quantity, promotion) {
    const formattedPromotion = this.#isPromotionActive(promotion);
    FileContentsValidator.validateProductData(
      name,
      price,
      quantity,
      formattedPromotion,
    );
    return { name, price, quantity, formattedPromotion };
  }

  #parseProductAttributes(line) {
    const [name, price, quantity, promotion] = line.split(',');
    const {
      name: validatedName,
      price: validatedPrice,
      quantity: validatedQuantity,
      formattedPromotion,
    } = this.#validateProductAttributes(name, price, quantity, promotion);
    return new Products(
      validatedName,
      Number(validatedPrice),
      Number(validatedQuantity),
      formattedPromotion,
    );
  }

  #loadProducts() {
    const data = readFile('products.md');
    const lines = data
      .split('\n')
      .slice(1)
      .filter((line) => line.trim() !== '');
    lines.forEach((line) => FileContentsValidator.validateLineFormat(line));

    return lines.map((line) => this.#parseProductAttributes(line));
  }

  getAllProducts() {
    return this.products;
  }
}
export default ProductService;
