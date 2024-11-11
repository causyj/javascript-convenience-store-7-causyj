/* eslint-disable max-lines-per-function */
import { Console } from '@woowacourse/mission-utils';

class OutputView {
  constructor() {
    this.flag = 0;
  }

  #formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price);
  }

  #hasStock(quantity) {
    if (quantity === 0) {
      return '재고 없음';
    }
    return `${quantity}개`;
  }

  #first(productList) {
    const groupedProducts = productList.reduce((acc, product) => {
      if (!acc[product.name]) {
        acc[product.name] = [];
      }
      acc[product.name].push(product);
      return acc;
    }, {});
    Object.values(groupedProducts).forEach((products) => {
      const primaryProduct = products[0];
      const secondProduct = products[1];
      const hasPromotion = primaryProduct.promotion !== '';
      const generalStockStatus = this.#hasStock(primaryProduct.generalQty);
      if (products.length !== 1 && hasPromotion) {
        Console.print(
          `- ${primaryProduct.name} ${this.#formatPrice(primaryProduct.price)}원 ${this.#hasStock(primaryProduct.promotionQty)} ${primaryProduct.promotion}`,
        );
        Console.print(
          `- ${secondProduct.name} ${this.#formatPrice(secondProduct.price)}원 ${this.#hasStock(secondProduct.generalQty)}`,
        );
        return;
      }
      if (products.length === 1 && hasPromotion) {
        Console.print(
          `- ${primaryProduct.name} ${this.#formatPrice(primaryProduct.price)}원 ${this.#hasStock(primaryProduct.promotionQty)} ${primaryProduct.promotion}`,
        );
        Console.print(
          `- ${primaryProduct.name} ${this.#formatPrice(primaryProduct.price)}원 재고 없음`,
        );
        return;
      }
      Console.print(
        `- ${primaryProduct.name} ${this.#formatPrice(primaryProduct.price)}원 ${generalStockStatus}`,
      );
    });
  }

  #next(productList) {
    productList.forEach((product) => {
      if (product.promotion !== '') {
        Console.print(
          `- ${product.name} ${this.#formatPrice(product.price)}원 ${this.#hasStock(product.promotionQty)} ${product.promotion}`,
        );
        Console.print(
          `- ${product.name} ${this.#formatPrice(product.price)}원 ${this.#hasStock(product.generalQty)}`,
        );
        return;
      }
      Console.print(
        `- ${product.name} ${this.#formatPrice(product.price)}원 ${this.#hasStock(product.generalQty)}`,
      );
    });
  }

  printProductList(productList) {
    Console.print(
      '안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다\n',
    );
    if (this.flag === 0) {
      this.#first(productList);
      this.flag = 1;
    } else {
      this.#next(productList);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  printFinalReceipt(purchaseItems, finalBill, membershipDiscount) {
    Console.print('\n==============W 편의점==============');
    Console.print('상품명\t\t수량\t금액');

    let totalPurchaseAmount = 0;
    let totalPromotionDiscount = 0;
    let count = 0;

    for (let i = 0; i < finalBill.length; i++) {
      const { price, finalPrice, discount } = finalBill[i];
      const { purchasedName, purchasedQty } = purchaseItems[i];
      if (purchasedQty === 0) {
        continue;
      }
      totalPurchaseAmount += finalPrice + discount;
      totalPromotionDiscount += discount;

      Console.print(
        `${purchasedName}\t\t${purchasedQty}\t${this.#formatPrice(price * purchasedQty)}`,
      );
      count += purchasedQty;
    }

    Console.print('==============증  정================');

    finalBill.forEach(({ name, freeItems }) => {
      if (freeItems > 0) {
        Console.print(`${name}\t\t${freeItems}`);
      }
    });
    Console.print('====================================');

    const totalDiscount = totalPromotionDiscount + membershipDiscount;
    const finalPayment = totalPurchaseAmount - totalDiscount;

    Console.print(
      `총구매액\t${count}\t${this.#formatPrice(totalPurchaseAmount)}`,
    );
    Console.print(`행사할인\t\t-${this.#formatPrice(totalPromotionDiscount)}`);
    Console.print(`멤버십할인\t\t-${this.#formatPrice(membershipDiscount)}`);
    Console.print(`내실돈\t\t\t${this.#formatPrice(finalPayment)}`);
  }
}
export default OutputView;
