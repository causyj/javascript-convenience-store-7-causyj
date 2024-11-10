import { Console } from "@woowacourse/mission-utils";

class OutputView {
  constructor() {
    this.flag = 0;
  }
  #hasStock(quantity) {
    if (quantity === 0) {
      return "재고 없음";
    }
    return `${quantity}개`;
  }
  #first(productList) {
    productList.forEach((product) => {
      const productQty =
        product.promotion === "" ? product.generalQty : product.promotionQty;
      const quantityStockStatus = this.#hasStock(productQty);
      Console.print(
        `- ${product.name} ${product.price}원 ${quantityStockStatus} ${product.promotion}`
      );
    });
  }

  #next(productList) {
    let previousProductName = null;

    productList.forEach((product) => {
      if (product.name === previousProductName) {
        return;
      }

      if (product.promotion) {
        const promotionStockStatus = this.#hasStock(product.promotionQty);
        Console.print(
          `- ${product.name} ${product.price}원 ${promotionStockStatus} ${product.promotion}`
        );
        const generalStockStatus = this.#hasStock(product.generalQty);
        Console.print(
          `- ${product.name} ${product.price}원 ${generalStockStatus}`
        );
      }

      // 두 번째 줄: 일반 수량 출력
      if (product.promotion === "") {
        const generalStockStatus = this.#hasStock(product.generalQty);
        Console.print(
          `- ${product.name} ${product.price}원 ${generalStockStatus}`
        );
      }

      // 현재 상품의 이름을 previousProductName에 저장하여 다음과 비교
      previousProductName = product.name;
    });
  }
  printProductList(productList) {
    Console.print(
      "안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다:\n"
    );
    let flag = 0;
    if (this.flag === 0) {
      this.#first(productList);
      this.flag = 1;
    } else {
      this.#next(productList);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  printFinalReceipt(purchaseItems, finalBill, membershipDiscount) {
    Console.print("==============W 편의점==============");
    Console.print("상품명\t\t수량\t금액");

    let totalPurchaseAmount = 0;
    let totalPromotionDiscount = 0;
    let count = 0;
    // 구매 상품 목록 및 행사할인
    for (let i = 0; i < purchaseItems.length; i++) {
      const { price, finalPrice, discount } = finalBill[i];
      const { purchasedName, purchasedQty } = purchaseItems[i];
      if (purchasedQty === 0) {
        return;
      }
      totalPurchaseAmount += finalPrice + discount;
      totalPromotionDiscount += discount;

      // 각 product와 일치하는 순서의 quantity 출력
      Console.print(
        `${purchasedName}\t\t${purchasedQty}\t${price * purchasedQty}`
      );
      count += purchasedQty;
    }

    // 증정 상품 목록 출력
    Console.print("==============증  정================");

    finalBill.forEach(({ name, freeItems }) => {
      if (freeItems > 0) {
        Console.print(`${name}\t\t${freeItems}`);
      }
    });
    Console.print("====================================");

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
