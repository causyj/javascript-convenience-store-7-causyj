import { Console } from '@woowacourse/mission-utils';
import InventoryService from '../servieces/InventoryService.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import InputValidator from '../validators/InputValidator.js';
import CheckoutService from '../servieces/CheckoutService.js';

class CStoreController {
  constructor() {
    this.inventoryService = new InventoryService();
    this.outputView = new OutputView();
    this.inputView = new InputView();
    this.checkoutService = new CheckoutService();
  }

  // async #safeInput(input, onError) {
  //   try {
  //     await input();
  //   } catch (error) {
  //     Console.print(error.message);
  //     await onError();
  //   }
  // }

  async start() {
    this.#printProductList();
    const items = await this.#getUserPurchaseItems();
    const finalItems = await this.#processItemsWithpromotion(items);
    this.#updateStock(finalItems);
    await this.#checkoutAndPrintReceipt(finalItems, items);
    await this.#askForAdditionalPurchase();
  }

  async #askForAdditionalPurchase() {
    const additionalPurchase = await this.inputView.askForAdditionalPurchase();
    Console.print(`additionalPurchase: ${additionalPurchase}`);
  }

  // productsWithPromotion.forEach((product) => {
  //   const discountText =
  //     product.discount > 0 ? ` (할인 적용: -${product.discount}원)` : '';
  //   Console.print(`${product.name}: ${product.finalPrice}원${discountText}`);
  // });
  async #checkoutAndPrintReceipt(finalItems, items) {
    const productsWithPromotion =
      this.checkoutService.calculateFinalPrices(finalItems);
    const membershipDiscount = await this.#applyMembershipDiscount(
      productsWithPromotion,
    );
    this.outputView.printFinalReceipt(
      items,
      productsWithPromotion,
      membershipDiscount || 0,
    );
  }

  #updateStock(finalItems) {
    finalItems.forEach(({ product, quantity }) => {
      product.reduceStock(quantity);
    });
  }

  async #applyMembershipDiscount(products) {
    const membershipInput = await this.inputView.getUserMembershipInput();
    const isMember = membershipInput === 'Y';

    if (!isMember) return 0;
    return this.checkoutService.calculateMembershipDiscount(products);
  }

  #isPromotionValid(product) {
    const promotionInstance = this.inventoryService.getPromotionsByName(
      product.promotion,
    );
    if (!promotionInstance) return false;
    return promotionInstance.checkPromotionPeriod();
  }

  // 3
  async #handlePromotionResult(promotionResult, product, quantity) {
    if (promotionResult.partialPromotion) {
      return await this.#partialPromotion(promotionResult, product, quantity);
    }
    if (promotionResult.extraRequired) {
      return await this.#extraRequiredPromotion(
        promotionResult,
        product,
        quantity,
      );
    }
    return [{ product, quantity, freeItems: promotionResult.maxFreeItems }];
  }

  //
  async #partialPromotion(promotionResult, product, quantity) {
    const isConfirmed = await this.#confirmWithoutPromotion(
      product,
      promotionResult,
    );
    return this.#partialPromotionResult(
      isConfirmed,
      promotionResult,
      product,
      quantity,
    );
  }

  async #confirmWithoutPromotion(product, promotionResult) {
    const userResponse =
      await this.inputView.getUserConfirmationWithoutPromotion(
        product.name,
        promotionResult.remainingQuantity,
      );
    return userResponse === 'Y';
  }

  #partialPromotionResult(isConfirmed, promotionResult, product, quantity) {
    const freeItems = this.checkoutService.calculateFreeItems(
      product,
      promotionResult,
      quantity,
    );
    if (!isConfirmed) {
      return [{ product, quantity: 0, freeItems: 0 }];
    }
    return [{ product, quantity, freeItems }];
  }
  //

  async #extraRequiredPromotion(promotionResult, product, quantity) {
    const extraConfirmed = await this.#confirmAdditionalPurchase(
      product,
      promotionResult,
    );
    return this.#finalPromotionResult(
      promotionResult,
      product,
      quantity,
      extraConfirmed,
    );
  }

  async #confirmAdditionalPurchase(product, promotionResult) {
    const userResponse = await this.inputView.getUserconfirmAdditionalPurchase(
      product.name,
      promotionResult.extraRequired,
    );
    return userResponse === 'Y';
  }

  #finalPromotionResult(promotionResult, product, quantity, extraConfirmed) {
    const adjustedQuantity = this.calculateAdjustedQuantity(
      extraConfirmed,
      quantity,
      promotionResult.extraRequired,
    );
    const freeItems = this.checkoutService.calculateFreeItemsWithConfirmation(
      extraConfirmed,
      promotionResult,
      adjustedQuantity,
      quantity,
    );
    return [{ product, quantity: adjustedQuantity, freeItems }];
  }

  calculateAdjustedQuantity(confirmed, baseQuantity, extra) {
    if (confirmed) {
      return baseQuantity + extra;
    }
    return baseQuantity;
  }

  // 2
  async #processSingleItemWithPromotion(item) {
    const products = this.inventoryService.getCombinedQuantity(item.name);
    const productWithPromotion = products.find((p) => p.promotion);

    if (productWithPromotion && this.#isPromotionValid(productWithPromotion)) {
      return await this.#getPromotionResult(item, productWithPromotion);
    }
    return [{ product: products[0], quantity: item.quantity }];
  }

  async #getPromotionResult(item, productWithPromotion) {
    const promotion = this.#fetchPromotionDetails(productWithPromotion);
    const promotionResult = this.#evaluatePromotionApplicability(
      item,
      productWithPromotion,
      promotion,
    );
    return await this.#handlePromotionResult(
      promotionResult,
      productWithPromotion,
      item.quantity,
    );
  }

  #fetchPromotionDetails(productWithPromotion) {
    return this.inventoryService.getPromotionsByName(
      productWithPromotion.promotion,
    );
  }

  #evaluatePromotionApplicability(item, productWithPromotion, promotion) {
    return this.checkoutService.isPromotionApplicable(
      productWithPromotion,
      promotion.buyAmount,
      promotion.freeAmount,
      item.quantity,
    );
  }

  // 1
  async #processItemsWithpromotion(items) {
    const processedItems = await Promise.all(
      items.map(async (item) => this.#processSingleItemWithPromotion(item)),
    );
    return processedItems.flat();
  }

  #printProductList() {
    const productList = this.inventoryService.getAllProducts();
    this.outputView.printProductList(productList);
  }

  async #getUserPurchaseItems() {
    const userPurchaseInput = await this.inputView.getUserPurchaseInput();
    return this.#parseUserPurchaseInput(userPurchaseInput);
  }

  #parseUserPurchaseInput(input) {
    return input.split(/\s*,\s*/).map((item) => this.#parseItem(item));
  }

  #parseItem(item) {
    InputValidator.validateUserPurchaseInput(item);
    const [name, quantity] = item.slice(1, -1).split('-');
    InputValidator.validateProduct(
      name,
      Number(quantity),
      this.inventoryService.getProductsNameList(),
      this.inventoryService.getProductQuantity(name),
    );
    return { name, quantity: Number(quantity) };
  }
}
export default CStoreController;
