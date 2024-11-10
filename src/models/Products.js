/* eslint-disable max-depth */
/* eslint-disable no-lonely-if */
class Products {
  constructor(name, price, promotion, promotionQty, generalQty) {
    this.name = name;
    this.price = price;
    this.promotion = promotion;
    this.promotionQty = promotionQty;
    this.generalQty = generalQty;
  }

  // eslint-disable-next-line max-lines-per-function
  reduceStock(purchasedQty) {
    if (this.promotion && this.promotionQty > 0) {
      if (this.promotionQty >= purchasedQty) {
        this.promotionQty -= purchasedQty;
      } else {
        const remainingQty = purchasedQty - this.promotionQty;
        this.generalQty -= remainingQty;
        this.promotionQty = 0;
      }
    } else {
      if (this.generalQty >= purchasedQty) {
        this.generalQty -= purchasedQty;
      } else {
        throw new Error('[ERROR] 재고가 부족합니다');
      }
    }
  }

  isPromotionAvailable() {
    if (this.promotion && this.promotion.name !== 'null') {
      return this.promotion.checkPromotionPeriod();
    }
    return false;
  }
}
export default Products;
