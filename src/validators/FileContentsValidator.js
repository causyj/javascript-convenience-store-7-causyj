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
    if (!isValidateNameString(name)) {
      throw new Error(`[ERROR] 프로모션 이름은 문자열이어야 합니다.`);
    }
    if (!isValidatePositiveInteger(buy) || Number(get) !== 1) {
      throw new Error(
        `[ERROR] 프로모션은 N개 구매 시 1개 무료 증정(Buy N Get 1 Free)의 형태입니다.`,
      );
    }
    if (!isValidateDateFormat(startDate) || !isValidateDateFormat(endDate)) {
      throw new Error(
        `[ERROR] 날짜 형식이 잘못되었습니다. (YYYY-MM-DD 형식이어야 합니다)`,
      );
    }
  }

  static #checkProductAttributesFormat(name, price, quantity, promotion) {
    if (!isValidateNameString(name) || !isValidateNameFormat(name)) {
      throw new Error(`[ERROR] 상품명은 한국어 혹은 영어로만 가능합니다.`);
    }
    if (!isValidatePositiveInteger(price)) {
      throw new Error(`[ERROR] 상품 가격은 양수여야 합니다`);
    }
    if (!isZeroOrPositiveInteger(quantity)) {
      throw new Error(`[ERROR] 상품 수량은 양수여야 합니다.`);
    }
    if (!isValidatePromotionString(promotion)) {
      throw new Error(`[ERROR] 프로모션 이름은 문자열이어야 합니다`);
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
}
export default FileContentsValidator;
