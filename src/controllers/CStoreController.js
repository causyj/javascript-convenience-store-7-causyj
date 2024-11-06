import ProductService from '../servieces/ProductService.js';
import OutputView from '../views/OutputView.js';

class CStoreController {
  constructor() {
    this.productService = new ProductService();
    this.outputView = new OutputView();
  }

  async start() {
    const productList = this.productService.getAllProducts();
    this.outputView.printProductList(productList);
  }
}
export default CStoreController;
