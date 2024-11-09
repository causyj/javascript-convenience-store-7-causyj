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

  // eslint-disable-next-line max-lines-per-function
  #parseProductAttributes(line) {
    const [name, price, quantity, promotion] = line.split(',');
    const {
      name: validatedName,
      price: validatedPrice,
      quantity: validatedQuantity,
      formattedPromotion,
    } = this.#validateProductAttributes(name, price, quantity, promotion);
    const promotionStock = promotion === '' ? 0 : Number(validatedQuantity);
    return new Products(
      validatedName,
      Number(validatedPrice),
      Number(validatedQuantity),
      formattedPromotion,
      promotionStock,
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

  // eslint-disable-next-line no-dupe-class-members, max-lines-per-function
  getProductsCombinedQuantity(name) {
    const matchedProducts = this.products.filter(
      (product) => product.name === name,
    );

    if (matchedProducts.length === 0) {
      return null;
    }

    // 동일한 이름을 가진 제품들의 수량을 합치고, 프로모션은 있는 항목으로 설정
    const combinedData = matchedProducts.reduce((acc, product) => {
      acc.quantity += product.quantity;

      // 첫 번째 프로모션이 있는 제품의 promotion과 promotionStock을 유지
      if (!acc.promotion && product.promotion) {
        acc.promotion = product.promotion;
        acc.promotionStock = product.promotionStock;
      }

      return acc;
    });

    // Products 클래스의 인스턴스로 반환, promotionStock도 전달
    const combinedProduct = new Products(
      combinedData.name,
      combinedData.price,
      combinedData.quantity,
      combinedData.promotion,
      combinedData.promotionStock,
    );

    return [combinedProduct];
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
