import { Console } from '@woowacourse/mission-utils';
import ProductService from '../servieces/ProductService.js';

class CStoreController {
  constructor() {
    this.productService = new ProductService();
  }

  async start() {
    const productList = this.productService.getAllProducts();
  }
}
export default CStoreController;
