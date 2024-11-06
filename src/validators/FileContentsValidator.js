import {
  isValidateNameFormat,
  isValidateNameString,
  isValidatePositiveInteger,
  isValidatePromotionString,
} from '../utils/validatorUtils.js';

class FileContentsValidator {
  static validateProductData(name, price, quantity, promotion) {
    if (!isValidateNameString(name) || !isValidateNameFormat(name)) {
      throw new Error(`[ERROR] 상품명은 한국어 혹은 영어로만 가능합니다.`);
    }
    if (!isValidatePositiveInteger(price)) {
      throw new Error(`[ERROR] 상품 가격은 양수여야 합니다`);
    }
    if (!isValidatePositiveInteger(quantity)) {
      throw new Error(`[ERROR] 상품 수량은 양수여야 합니다.`);
    }
    if (!isValidatePromotionString(promotion)) {
      throw new Error(`[ERROR] 프로모션 이름은 문자열이어야 합니다`);
    }
  }
}
export default FileContentsValidator;
