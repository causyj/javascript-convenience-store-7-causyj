class CheckoutService {
  #getExtraQtyNeeded(purchasedQty, buyAmount, freeAmount) {
    if (purchasedQty < buyAmount) {
      return 0;
    }
    const totalPromotionQty = buyAmount + freeAmount;
    if (purchasedQty % totalPromotionQty === 0) {
      return 0;
    }
    return totalPromotionQty - (purchasedQty % totalPromotionQty);
  }

  // eslint-disable-next-line max-lines-per-function
  isPromotionApplicable(purchaseItem, buyAmount, freeAmount, products) {
    const additionalQtyNeeded = this.#getExtraQtyNeeded(
      purchaseItem.purchasedQty,
      buyAmount,
      freeAmount,
    );
    const extraRequired =
      additionalQtyNeeded <= freeAmount ? additionalQtyNeeded : 0;
    const promotionStockSufficient =
      products.promotionQty >= purchaseItem.purchasedQty + extraRequired;
    const partialPromotion = !promotionStockSufficient;
    const remainingQuantity = promotionStockSufficient
      ? 0
      : purchaseItem.purchasedQty + extraRequired - products.promotionQty;
    // const maxFreeItems =
    //   Math.floor((quantity + extraRequired) / (buyAmount + freeAmount)) *
    //   freeAmount;

    const maxFreeItems =
      products.promotionQty < purchaseItem.purchasedQty
        ? Math.floor(
            (products.promotionQty - extraRequired) / (buyAmount + freeAmount),
          ) * Number(freeAmount)
        : Math.floor(
            (purchaseItem.purchasedQty + extraRequired) /
              (buyAmount + freeAmount),
          ) * Number(freeAmount);
    return {
      extraRequired,
      partialPromotion,
      remainingQuantity,
      maxFreeItems,
      buyAmount,
      freeAmount,
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

  calculateFreeItems(product, promotionResult, quantity) {
    if (quantity <= product.promotionQty) {
      return promotionResult.maxFreeItems;
    }
    return (
      Math.floor(
        product.promotionQty /
          (promotionResult.buyAmount + promotionResult.freeAmount),
      ) * promotionResult.freeAmount
    );
  }

  // eslint-disable-next-line max-lines-per-function
  calculateFreeItemsWithConfirmation(
    extraConfirmed,
    promotionResult,
    quantity,
  ) {
    if (!extraConfirmed) {
      return (
        Math.floor(
          quantity / (promotionResult.buyAmount + promotionResult.freeAmount),
        ) * promotionResult.freeAmount
      );
    }
    return promotionResult.maxFreeItems;
  }
}

export default CheckoutService;
