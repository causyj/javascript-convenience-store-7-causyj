import Products from '../models/Products.js';
import FileContentsValidator from '../validators/FileContentsValidator.js';
import { getLinesFromFile } from '../utils/fileUtils.js';
import Promotion from '../models/Promotion.js';

class InventoryService {
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
    return new Promotion(
      name.trim(),
      Number(buy),
      Number(get),
      startDate.trim(),
      endDate.trim(),
    );
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

  getProductsNameList() {
    return this.products.map((product) => product.name);
  }

  getProductQuantity(name) {
    return this.products
      .filter((product) => product.name === name)
      .reduce((total, product) => total + product.quantity, 0);
  }

  getProductsByName(name) {
    return this.products.filter((product) => product.name === name);
  }

  getPromotionsByName(name) {
    return this.promotions.find((promotion) => promotion.name === name);
  }

  // checkPromotionPeriod2(promotion) {
  //   const currentDate = DateTimes.now();
  //   const e = promotion.startDate;
  //   const d = new Date(promotion.startDate);
  //   Console.print(e);
  //   Console.print(d);
  //   return (
  //     currentDate >= new Date(promotion.startDate) &&
  //     currentDate <= new Date(promotion.endDate)
  //   );
  // }
}
export default InventoryService;
