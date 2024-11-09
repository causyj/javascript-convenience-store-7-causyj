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
    const maxFreeItems =
      Math.floor((quantity + extraRequired) / (buyAmount + freeAmount)) *
      freeAmount;
    const partialPromotion = !promotionStockSufficient;
    const remainingQuantity = promotionStockSufficient
      ? 0
      : quantity + extraRequired - productWithPromotion.promotionStock;

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
      const discount = freeItems * product.price;
      return {
        ...product,
        discount,
        finalPrice: product.price * quantity - discount,
      };
    });
  }
}
export default CheckoutService;
