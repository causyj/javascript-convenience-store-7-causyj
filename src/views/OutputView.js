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
    let count = 0;
    // 구매 상품 목록 및 행사할인
    for (let i = 0; i < productsWithPromotion.length; i++) {
      const { name, finalPrice, discount } = productsWithPromotion[i];
      const { quantity } = products[i]; // products 배열의 순서에 맞게 접근

      totalPurchaseAmount += finalPrice + discount;
      totalPromotionDiscount += discount;

      // 각 product와 일치하는 순서의 quantity 출력
      Console.print(`${name}\t\t${quantity}\t${finalPrice}`);
      count += quantity;
    }

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

    Console.print(`총구매액\t${count}\t${totalPurchaseAmount}`);
    Console.print(`행사할인\t\t-${totalPromotionDiscount}`);
    Console.print(`멤버십할인\t\t-${membershipDiscount}`);
    Console.print(`내실돈\t\t\t ${finalPayment}`);
  }
}
export default OutputView;
