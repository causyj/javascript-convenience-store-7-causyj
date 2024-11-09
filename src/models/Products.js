class Products {
  constructor(name, price, quantity, promotion) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    // 삼항연산자 제거
    this.promotion = promotion;
    this.promotionStock = promotion ? quantity : 0;
  }

  reduceStock(amount) {
    if (this.promotion && this.promotionStock >= amount) {
      this.promotionStock -= amount;
      return;
    }

    if (this.quantity >= amount) {
      this.quantity -= amount;
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
