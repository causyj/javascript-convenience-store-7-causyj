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

  // eslint-disable-next-line max-lines-per-function
  printFinalReceipt(products, productsWithPromotion, membershipDiscount) {
    Console.print('==============W 편의점==============');
    Console.print('상품명\t\t수량\t금액');

    let totalPurchaseAmount = 0;
    let totalPromotionDiscount = 0;

    // 구매 상품 목록 및 행사할인
    productsWithPromotion.forEach(({ name, finalPrice, discount }) => {
      totalPurchaseAmount += finalPrice + discount;
      totalPromotionDiscount += discount;
      products.forEach((item) => {
        Console.print(`${name}\t\t${item.quantity}\t${finalPrice}`);
      });
      //  Console.print(`${name}\t\t${quantity}\t${finalPrice}`);
    });

    // 증정 상품 목록 출력
    Console.print('==============증  정================');

    productsWithPromotion.forEach(({ name, freeItems }) => {
      if (freeItems > 0) {
        Console.print(`${name}\t\t${freeItems}`);
      }
    });
    Console.print('====================================');

    // 총구매액, 행사할인, 멤버십할인 및 최종 결제 금액
    const totalDiscount = totalPromotionDiscount + membershipDiscount;
    const finalPayment = totalPurchaseAmount - totalDiscount;

    Console.print(`총구매액\t\t${totalPurchaseAmount}`);
    Console.print(`행사할인\t\t-${totalPromotionDiscount}`);
    Console.print(`멤버십할인\t\t-${membershipDiscount}`);
    Console.print(`내실돈\t\t\t ${finalPayment}`);
  }
}
export default OutputView;
