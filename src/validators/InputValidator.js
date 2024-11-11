import { isValidatePositiveInteger } from '../utils/validatorUtils.js';

class InputValidator {
  static validateUserPurchaseInput(input) {
    if (!input.match(/\[.+?-\d+\]/)) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
      );
    }
  }

  static validateProduct(name, quantity, productNameList, availableQuantity) {
    this.#validateQuantity(quantity);
    this.#validateProductExists(name, productNameList);
    this.#validateStockAvailability(quantity, availableQuantity);
  }

  static #validateQuantity(quantity) {
    if (!isValidatePositiveInteger(quantity)) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
      );
    }
  }

  static #validateProductExists(name, productNameList) {
    if (!productNameList.includes(name)) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    }
  }

  static #validateStockAvailability(quantity, availableQuantity) {
    if (quantity > availableQuantity) {
      throw new Error(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
      );
    }
  }

  static validateYesNoInput(input) {
    const trimmedInput = input.trim().toUpperCase();
    if (trimmedInput !== 'Y' && trimmedInput !== 'N') {
      throw new Error('[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.');
    }
  }
}
export default InputValidator;
