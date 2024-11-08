import { Console } from '@woowacourse/mission-utils';
import InventoryService from '../servieces/InventoryService.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import InputValidator from '../validators/InputValidator.js';

class CStoreController {
  constructor() {
    this.inventoryService = new InventoryService();
    this.outputView = new OutputView();
    this.inputView = new InputView();
  }

  async #safeInput(input, onError) {
    try {
      await input();
    } catch (error) {
      Console.print(error.message);
      await onError();
    }
  }

  async start() {
    this.#printProductList();
    const items = await this.#getUserPurchaseItems();
  }

  #printProductList() {
    const productList = this.inventoryService.getAllProducts();
    this.outputView.printProductList(productList);
  }

  async #getUserPurchaseItems() {
    await this.#safeInput(
      async () => {
        const userPurchaseInput = await this.inputView.getUserPurchaseInput();
        return this.#parseUserPurchaseInput(userPurchaseInput);
      },
      async () => {
        await this.#getUserPurchaseItems();
      },
    );
  }

  #parseUserPurchaseInput(input) {
    return input.split(/\s*,\s*/).map((item) => this.#parseItem(item));
  }

  #parseItem(item) {
    InputValidator.validateUserPurchaseInput(item);
    const [name, quantity] = item.slice(1, -1).split('-');
    InputValidator.validateProduct(
      name,
      Number(quantity),
      this.inventoryService.getProductsNameList(),
      this.inventoryService.getProductQuantity(name),
    );
    return { name, quantity: Number(quantity) };
  }
}
export default CStoreController;
