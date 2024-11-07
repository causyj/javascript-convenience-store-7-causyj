import Products from '../models/Products.js';
import FileContentsValidator from '../validators/FileContentsValidator.js';
import { getLinesFromFile } from '../utils/fileUtils.js';

class ProductService {
  constructor() {
    this.promotions = this.#loadPromotions();
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
    const promotionNameList = this.promotions.map((promo) => promo.name);

    FileContentsValidator.validateProductData(
      name,
      price,
      quantity,
      formattedPromotion,
      promotionNameList,
    );
    return { name, price, quantity, formattedPromotion };
  }

  // eslint-disable-next-line max-lines-per-function
  #parsePromotionAttributes(line) {
    const [name, buy, get, startDate, endDate] = line.split(',');
    FileContentsValidator.validatePromotionData(
      name,
      buy,
      get,
      startDate,
      endDate,
    );
    return {
      name: name.trim(),
      buy: Number(buy),
      get: Number(get),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
    };
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

  #loadPromotions() {
    const lines = getLinesFromFile('promotions.md');
    lines.forEach((line) => FileContentsValidator.validateLineFormat(line, 5));
    return lines.map((line) => this.#parsePromotionAttributes(line));
  }

  #loadProducts() {
    const lines = getLinesFromFile('products.md');
    lines.forEach((line) => FileContentsValidator.validateLineFormat(line, 4));

    return lines.map((line) => this.#parseProductAttributes(line));
  }

  getAllProducts() {
    return this.products;
  }
}
export default ProductService;
