import {
  isValidateDateFormat,
  isValidateNameFormat,
  isValidateNameString,
  isValidatePositiveInteger,
  isValidatePromotionString,
  isZeroOrPositiveInteger,
} from '../utils/validatorUtils.js';

class FileContentsValidator {
  static validateLineFormat(line, attributesCnt) {
    const attributes = line.split(',');
    if (attributes.length !== attributesCnt) {
      throw new Error(
        '[ERROR] 상품 정보의 형식이 잘못되었습니다. 각 상품은 이름, 가격, 수량, (선택적) 프로모션 정보로 구성되어야 합니다.',
      );
    }
  }

  static validatePromotionData(name, buy, get, startDate, endDate) {
    this.#validateName(name);
    this.#validateBuyAndGet(buy, get);
    this.#validateDates(startDate, endDate);
  }

  static #validateName(name) {
    if (!isValidateNameString(name)) {
      throw new Error('[ERROR] 프로모션 이름은 문자열이어야 합니다.');
    }
  }

  static #validateBuyAndGet(buy, get) {
    if (!isValidatePositiveInteger(buy) || Number(get) !== 1) {
      throw new Error(
        '[ERROR] 프로모션은 N개 구매 시 1개 무료 증정(Buy N Get 1 Free)의 형태입니다.',
      );
    }
  }

  static #validateDates(startDate, endDate) {
    if (!isValidateDateFormat(startDate) || !isValidateDateFormat(endDate)) {
      throw new Error(
        '[ERROR] 날짜 형식이 잘못되었습니다. (YYYY-MM-DD 형식이어야 합니다)',
      );
    }
  }

  static #checkProductAttributesFormat(name, price, quantity, promotion) {
    this.#checkNameFormat(name);
    this.#checkPrice(price);
    this.#checkQuantity(quantity);
    this.#checkPromotion(promotion);
  }

  static #checkNameFormat(name) {
    if (!isValidateNameString(name) || !isValidateNameFormat(name)) {
      throw new Error('[ERROR] 상품명은 한국어 혹은 영어로만 가능합니다.');
    }
  }

  static #checkPrice(price) {
    if (!isValidatePositiveInteger(price)) {
      throw new Error('[ERROR] 상품 가격은 양수여야 합니다');
    }
  }

  static #checkQuantity(quantity) {
    if (!isZeroOrPositiveInteger(quantity)) {
      throw new Error('[ERROR] 상품 수량은 양수여야 합니다.');
    }
  }

  static #checkPromotion(promotion) {
    if (!isValidatePromotionString(promotion)) {
      throw new Error('[ERROR] 프로모션 이름은 문자열이어야 합니다');
    }
  }

  static #checkPromotionNameExists(promotion, promotionNameList) {
    if (promotion && !promotionNameList.includes(promotion)) {
      throw new Error('[ERROR] 상품의 프로모션 이름이 유효하지 않습니다');
    }
  }

  static validateProductData(
    name,
    price,
    quantity,
    promotion,
    promotionNameList,
  ) {
    this.#checkProductAttributesFormat(name, price, quantity, promotion);
    this.#checkPromotionNameExists(promotion, promotionNameList);
  }

  // eslint-disable-next-line max-lines-per-function
  static validateNoMultiplePromotions(productsList) {
    const productPromotionMap = {};
    productsList.forEach((product) => {
      if (!productPromotionMap[product.name]) {
        productPromotionMap[product.name] = product.promotion;
      } else if (productPromotionMap[product.name] && product.promotion) {
        throw new Error(
          `[ERROR] 한 상품에 여러 프로모션이 적용될 수 없습니다.`,
        );
      }
    });
  }
}
export default FileContentsValidator;
