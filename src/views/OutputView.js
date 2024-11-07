import { Console } from '@woowacourse/mission-utils';

class OutputView {
  #hasStock(quantity) {
    if (quantity === 0) {
      return '재고 없음';
    }
    return `${quantity}개`;
  }

  printProductList(products) {
    Console.print(
      '안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다:\n',
    );

    products.forEach((product) => {
      const quantityStockStatus = this.#hasStock(product.quantity);
      Console.print(
        `- ${product.name} ${product.price}원 ${quantityStockStatus} ${product.promotion}`,
      );
    });
  }
}
export default OutputView;
