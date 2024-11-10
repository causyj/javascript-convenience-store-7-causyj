class UserInputItem {
  constructor(name, quantity) {
    this.purchasedName = name;
    this.purchasedQty = quantity;
  }

  increasePurchaseQuantity(extraPurchase) {
    this.purchasedQty += extraPurchase;
  }

  cancelPurchase() {
    this.purchasedQty = 0;
  }
}
export default UserInputItem;
