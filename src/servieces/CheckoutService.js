import { Console } from '@woowacourse/mission-utils';

class CheckoutService {
  extraR(quantity, buyAmount, freeAmount) {
    if (quantity < buyAmount) {
      return 0;
    }
    if (quantity % (buyAmount + freeAmount) === 0) {
      return 0;
    }
    return buyAmount + freeAmount - (quantity % (buyAmount + freeAmount));
  }

  // eslint-disable-next-line max-lines-per-function
  isPromotionApplicable(productWithPromotion, buyAmount, freeAmount, quantity) {
    // eslint-disable-next-line no-shadow

    const extraRequire = this.extraR(quantity, buyAmount, freeAmount);
    const extraRequired = extraRequire <= freeAmount ? extraRequire : 0;
    Console.print(`extraRequired : ${extraRequired}`);
    const promotionStockSufficient =
      productWithPromotion.promotionStock >= quantity + extraRequired;

    Console.print(`promotionStockSufficient:${promotionStockSufficient}`);
    const partialPromotion = !promotionStockSufficient;
    const remainingQuantity = promotionStockSufficient
      ? 0
      : quantity + extraRequired - productWithPromotion.promotionStock;
    // const maxFreeItems =
    //   Math.floor((quantity + extraRequired) / (buyAmount + freeAmount)) *
    //   freeAmount;

    const maxFreeItems =
      productWithPromotion.promotionStock < quantity
        ? Math.floor(
            (productWithPromotion.promotionStock - extraRequired) /
              (buyAmount + freeAmount),
          ) * Number(freeAmount)
        : Math.floor((quantity + extraRequired) / (buyAmount + freeAmount)) *
          Number(freeAmount);
    Console.print(`maxFreeItems : ${maxFreeItems}`);
    return {
      extraRequired,
      partialPromotion,
      remainingQuantity,
      buyAmount,
      freeAmount,
      maxFreeItems,
    };
  }

  calculateFinalPrices(items) {
    return items.map(({ product, quantity, freeItems }) => {
      const free = product.promotion === '' ? 0 : freeItems;
      const discount = free * product.price;
      return {
        ...product,
        discount,
        finalPrice: product.price * quantity - discount,
        freeItems,
      };
    });
  }

  calculateMembershipDiscount(items) {
    const nonPromotionTotal = items
      .filter((item) => item.discount === 0)
      .reduce((total, item) => total + item.finalPrice, 0);
    const membershipDiscount = Math.min(nonPromotionTotal * 0.3, 8000);
    return membershipDiscount;
  }
}
export default CheckoutService;
