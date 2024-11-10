/* eslint-disable no-param-reassign */
/* eslint-disable max-lines-per-function */
import Products from "../models/Products.js";
import FileContentsValidator from "../validators/FileContentsValidator.js";
import { getLinesFromFile } from "../utils/fileUtils.js";
import Promotion from "../models/Promotion.js";

class InventoryService {
  constructor() {
    this.promotions = this.#loadPromotions();
    this.originalProducts = this.#loadProducts(); // 원본 데이터
    this.products = null;
  }
  #combineProducts(productsList) {
    const combinedProducts = {};

    productsList.forEach((product) => {
      if (!combinedProducts[product.name]) {
        combinedProducts[product.name] = new Products(
          product.name,
          product.price,
          product.promotion,
          product.promotion ? product.promotionQty : 0,
          product.promotion ? 0 : product.generalQty
        );
      } else {
        if (product.promotion) {
          combinedProducts[product.name].promotionQty += product.promotionQty;
        } else {
          combinedProducts[product.name].generalQty += product.generalQty;
        }
      }
    });

    return Object.values(combinedProducts);
  }
  #isPromotionActive(promotion) {
    if (promotion.trim() === "null") {
      return "";
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
      promotionNameList
    );
    return { name, price, quantity, formattedPromotion };
  }

  // eslint-disable-next-line max-lines-per-function
  #parsePromotionAttributes(line) {
    const [name, buy, get, startDate, endDate] = line.split(",");
    FileContentsValidator.validatePromotionData(
      name,
      buy,
      get,
      startDate,
      endDate
    );
    return new Promotion(
      name.trim(),
      Number(buy),
      Number(get),
      startDate.trim(),
      endDate.trim()
    );
  }

  // eslint-disable-next-line max-lines-per-function
  #parseProductAttributes(line) {
    const [name, price, quantity, promotion] = line.split(",");
    const {
      name: validatedName,
      price: validatedPrice,
      quantity: validatedQuantity,
      formattedPromotion,
    } = this.#validateProductAttributes(name, price, quantity, promotion);
    const promotionQty =
      formattedPromotion === "" ? 0 : Number(validatedQuantity);
    const generalQty =
      formattedPromotion === "" ? Number(validatedQuantity) : 0;
    return new Products(
      validatedName,
      Number(validatedPrice),
      formattedPromotion,
      promotionQty,
      generalQty
    );
  }

  #loadPromotions() {
    const lines = getLinesFromFile("promotions.md");
    lines.forEach((line) => FileContentsValidator.validateLineFormat(line, 5));
    return lines.map((line) => this.#parsePromotionAttributes(line));
  }

  #loadProducts() {
    const lines = getLinesFromFile("products.md");
    lines.forEach((line) => FileContentsValidator.validateLineFormat(line, 4));

    return lines.map((line) => this.#parseProductAttributes(line));
  }
  getAllProducts() {
    if (!this.products) {
      this.products = this.#combineProducts(this.originalProducts);
      return this.originalProducts; // 첫 출력 시 원본 데이터 사용
    }
    return this.products; // 이후 결합된 데이터 사용
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
  getCombinedQuantity(name) {
    const matchedProducts = this.products.filter(
      (product) => product.name === name
    );
    if (matchedProducts.length === 0) {
      return null;
    }

    const combinedData = matchedProducts.reduce(
      (acc, product) => {
        acc.generalQty += product.generalQty;
        acc.promotionQty += product.promotionQty;
        acc.promotion = acc.promotion || product.promotion;
        return acc;
      },
      {
        name,
        price: matchedProducts[0].price,
        generalQty: 0,
        promotionQty: 0,
        promotion: "",
      }
    );

    // Products 클래스의 인스턴스로 반환, promotionStock도 전달
    const combinedProduct = new Products(
      combinedData.name,
      combinedData.price,
      combinedData.promotion,
      combinedData.promotionQty,
      combinedData.generalQty
    );

    return combinedProduct;
  }

  updateProducts(updatedItems) {
    updatedItems.forEach((updatedItem) => {
      const product = (this.products || this.originalProducts).find(
        (p) => p.name === updatedItem.product.name
      );
      if (product) {
        product.promotionQty = updatedItem.product.promotionQty;
        product.generalQty = updatedItem.product.generalQty;
      }
    });
  }
}
export default InventoryService;
