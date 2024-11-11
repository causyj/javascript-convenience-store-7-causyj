class Products {
  constructor(name, price, promotion, promotionQty, generalQty) {
    this.name = name;
    this.price = price;
    this.promotion = promotion;
    this.promotionQty = promotionQty;
    this.generalQty = generalQty;
  }

  reduceStock(purchasedQty) {
    if (this.promotion && this.promotionQty > 0) {
      this.#handlePromotionStock(purchasedQty);
      return;
    }
    this.#handleGeneralStock(purchasedQty);
  }

  #handlePromotionStock(purchasedQty) {
    if (this.promotionQty >= purchasedQty) {
      this.promotionQty -= purchasedQty;
      return;
    }
    const remainingQty = purchasedQty - this.promotionQty;
    this.generalQty -= remainingQty;
    this.promotionQty = 0;
  }

  #handleGeneralStock(purchasedQty) {
    if (this.generalQty >= purchasedQty) {
      this.generalQty -= purchasedQty;
      return;
    }
    throw new Error('[ERROR] 재고가 부족합니다');
  }

  isPromotionAvailable() {
    if (this.promotion && this.promotion.name !== 'null') {
      return this.promotion.checkPromotionPeriod();
    }
    return false;
  }
}
export default Products;
