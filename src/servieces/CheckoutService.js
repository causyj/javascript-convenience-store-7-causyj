class CheckoutService {
  #getExtraQtyNeeded(purchasedQty, buyAmount, totalPromotionQty) {
    if (purchasedQty < buyAmount) {
      return 0;
    }

    if (purchasedQty % totalPromotionQty === 0) {
      return 0;
    }
    return totalPromotionQty - (purchasedQty % totalPromotionQty);
  }

  // eslint-disable-next-line max-lines-per-function
  isPromotionApplicable(purchaseItem, buyAmount, freeAmount, products) {
    const totalPromotionQty = buyAmount + freeAmount;
    const additionalQtyNeeded = this.#getExtraQtyNeeded(
      purchaseItem.purchasedQty,
      buyAmount,
      totalPromotionQty
    );
    const extraRequired =
      additionalQtyNeeded <= freeAmount ? additionalQtyNeeded : 0;
    const promotionStockSufficient =
      products.promotionQty >= purchaseItem.purchasedQty + extraRequired;
    const partialPromotion = !promotionStockSufficient;

    const maxFreeItems =
      products.promotionQty < purchaseItem.purchasedQty
        ? Math.floor(
            (products.promotionQty - extraRequired) / (buyAmount + freeAmount)
          ) * Number(freeAmount)
        : Math.floor(
            (purchaseItem.purchasedQty + extraRequired) /
              (buyAmount + freeAmount)
          ) * Number(freeAmount);
    const remainingQuantity = promotionStockSufficient
      ? 0
      : purchaseItem.purchasedQty - totalPromotionQty * maxFreeItems;

    return {
      extraRequired,
      partialPromotion,
      remainingQuantity,
      maxFreeItems,
      buyAmount,
      freeAmount,
    };
  }

  calculateFinalPrices(finalItems) {
    return finalItems.map(({ product, purchasedQty, freeItems }) => {
      const free = product.promotion === "" ? 0 : freeItems;
      const discount = free * product.price;
      return {
        ...product,
        discount,
        finalPrice: product.price * purchasedQty - discount,
        freeItems,
      };
    });
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
    return (
      Math.floor(
        product.promotionQty /
          (promotionResult.buyAmount + promotionResult.freeAmount)
      ) * promotionResult.freeAmount
    );
  }

  // eslint-disable-next-line max-lines-per-function
  calculateFreeItemsWithConfirmation(
    extraConfirmed,
    promotionResult,
    quantity
  ) {
    if (!extraConfirmed) {
      return (
        Math.floor(
          quantity / (promotionResult.buyAmount + promotionResult.freeAmount)
        ) * promotionResult.freeAmount
      );
    }
    return promotionResult.maxFreeItems;
  }
}

export default CheckoutService;
