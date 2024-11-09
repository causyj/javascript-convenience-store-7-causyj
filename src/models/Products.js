/* eslint-disable no-lonely-if */
class Products {
  constructor(name, price, quantity, promotion, promotionStock) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    // 삼항연산자 제거
    this.promotion = promotion;
    this.promotionStock = promotionStock;
  }

  // eslint-disable-next-line max-lines-per-function
  reduceStock(amount) {
    if (this.promotion && this.promotionStock > 0) {
      // 먼저 promotionStock에서 가능한 만큼 차감
      if (this.promotionStock >= amount) {
        this.promotionStock -= amount;
        this.quantity -= amount;
      } else {
        // promotionStock을 모두 소진하고, 남은 수량을 remainingAmount로 계산
        // const remainingAmount = amount - this.promotionStock;
        this.quantity -= amount;
        this.promotionStock = 0;
      }
    } else {
      // promotion이 없거나 promotionStock이 0인 경우, 전체 수량을 quantity에서 차감
      if (this.quantity >= amount) {
        this.quantity -= amount;
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
