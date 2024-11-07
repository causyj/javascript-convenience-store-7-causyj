import { Console } from '@woowacourse/mission-utils';
import ProductService from '../servieces/ProductService.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class CStoreController {
  constructor() {
    this.productService = new ProductService();
    this.outputView = new OutputView();
    this.inputView = new InputView();
  }

  async start() {
    const productList = this.productService.getAllProducts();
    this.outputView.printProductList(productList);

    const usePurchaseInput = await this.inputView.getUserPurchaseInput();
    Console.print(usePurchaseInput);
  }
}
export default CStoreController;
