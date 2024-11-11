/* eslint-disable max-lines-per-function */
import { calulateFreeItemCnt } from '../utils/purchaseUtils.js';

class CheckoutService {
  #getExtraQtyNeeded(purchasedQty, buyAmount, freeAmount) {
    if (purchasedQty < buyAmount) {
      return 0;
    }
    if (purchasedQty % (buyAmount + freeAmount) === 0) {
      return 0;
    }
    return buyAmount + freeAmount - (purchasedQty % (buyAmount + freeAmount));
  }

  isPromotionApplicable(purchaseItem, buyAmount, freeAmount, products) {
    const { promotionQty } = products;
    const additionalQtyNeeded = this.#getExtraQtyNeeded(
      purchaseItem.purchasedQty,
      buyAmount,
      freeAmount,
    );
    const extraRequired = this.#getExtraRequired(
      additionalQtyNeeded,
      freeAmount,
    );
    const promotionStockSufficient =
      promotionQty >= purchaseItem.purchasedQty + extraRequired;
    const partialPromotion = !promotionStockSufficient;
    const maxFreeItems = this.#getMaxItems(
      purchaseItem,
      promotionQty,
      extraRequired,
      buyAmount,
      freeAmount,
    );
    const remainingQuantity = this.#getRemainingQuantity(
      promotionStockSufficient,
      purchaseItem.purchasedQty,
      buyAmount,
      freeAmount,
      maxFreeItems,
    );

    return {
      extraRequired,
      partialPromotion,
      remainingQuantity,
      maxFreeItems,
      buyAmount,
      freeAmount,
    };
  }

  #getRemainingQuantity(
    promotionStockSufficient,
    purchasedQty,
    buyAmount,
    freeAmount,
    maxFreeItems,
  ) {
    if (promotionStockSufficient) {
      return 0;
    }
    return purchasedQty - (buyAmount + freeAmount) * maxFreeItems;
  }

  #getExtraRequired(additionalQtyNeeded, freeAmount) {
    if (additionalQtyNeeded <= freeAmount) {
      return additionalQtyNeeded;
    }
    return 0;
  }

  #getMaxItems(
    purchaseItem,
    promotionQty,
    extraRequired,
    buyAmount,
    freeAmount,
  ) {
    if (promotionQty <= purchaseItem.purchasedQty) {
      return calulateFreeItemCnt(
        promotionQty - extraRequired,
        buyAmount,
        freeAmount,
      );
    }
    return calulateFreeItemCnt(
      purchaseItem.purchasedQty + extraRequired,
      buyAmount,
      freeAmount,
    );
  }

  calculateFinalPrices(finalItems) {
    return finalItems.map(({ product, purchasedQty, freeItems }) => {
      const free = this.#getFree(product.promotion, freeItems);
      const discount = free * product.price;
      return {
        ...product,
        discount,
        finalPrice: product.price * purchasedQty - discount,
        freeItems,
      };
    });
  }

  #getFree(promotion, freeItems) {
    if (promotion === '') {
      return 0;
    }
    return freeItems;
  }

  calculateMembershipDiscount(finalBill) {
    const nonPromotionTotal = finalBill
      .filter((item) => item.discount === 0)
      .reduce((total, item) => total + item.finalPrice, 0);
    const membershipDiscount = Math.min(nonPromotionTotal * 0.3, 8000);
    return membershipDiscount;
  }

  calculateFreeItems(product, promotionResult, quantity) {
    if (quantity <= product.promotionQty) {
      return promotionResult.maxFreeItems;
    }
    return calulateFreeItemCnt(
      product.promotionQty,
      promotionResult.buyAmount,
      promotionResult.freeAmount,
    );
  }

  calculateFreeItemsWithConfirmation(
    extraConfirmed,
    promotionResult,
    quantity,
  ) {
    if (!extraConfirmed) {
      return calulateFreeItemCnt(
        quantity,
        promotionResult.buyAmount,
        promotionResult.freeAmount,
      );
    }
    return promotionResult.maxFreeItems;
  }
}

export default CheckoutService;
