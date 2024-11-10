import { isValidatePositiveInteger } from '../utils/validatorUtils.js';

class InputValidator {
  static validateUserPurchaseInput(input) {
    if (!input.match(/\[.+?-\d+\]/)) {
      throw new Error('[ERROR] [상품-수량]의 형식에 맞게 입력해주세요');
    }
  }

  static validateProduct(name, quantity, productNameList, availableQuantity) {
    if (!isValidatePositiveInteger(quantity)) {
      throw new Error('[ERROR] 상품의 수량을 다시 입력해주세요');
    }
    if (!productNameList.includes(name)) {
      throw new Error('[ERROR] 편의점에 없는 상품입니다.');
    }
    if (quantity > availableQuantity) {
      throw new Error(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
      );
    }
  }

  static validateYesNoInput(input) {
    const trimmedInput = input.trim().toUpperCase();
    if (trimmedInput !== 'Y' && trimmedInput !== 'N') {
      throw new Error('[ERROR] Y 또는 N으로 대답해주세요.');
    }
  }
}
export default InputValidator;
