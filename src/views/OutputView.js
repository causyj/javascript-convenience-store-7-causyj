import { Console } from '@woowacourse/mission-utils';

class OutputView {
  printProductList(products) {
    Console.print('현재 보유하고 있는 상품입니다:\n');
    products.forEach((product) => {
      Console.print(
        `- ${product.name} ${product.price}원 ${product.quantity}개 ${product.promotion ? product.promotion : ''}`,
      );
    });
  }
}
export default OutputView;
