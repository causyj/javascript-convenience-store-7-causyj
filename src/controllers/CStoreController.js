// 일반 재고에서만 차감 안될 때

/* eslint-disable max-lines-per-function */
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

  // eslint-disable-next-line max-lines-per-function
  async start() {
    this.#printProductList();
    const items = await this.#getUserPurchaseItems();

    const finalItems = await this.#processItemsWithpromotion(items);
    Console.print(finalItems);
    finalItems.forEach(({ product, quantity }) => {
      product.reduceStock(quantity);
    });
    const productsWithPromotion =
      this.checkoutService.calculateFinalPrices(finalItems);
    productsWithPromotion.forEach((product) => {
      const discountText =
        product.discount > 0 ? ` (할인 적용: -${product.discount}원)` : '';
      Console.print(`${product.name}: ${product.finalPrice}원${discountText}`);
    });
    Console.print(finalItems);
  }

  #isPromotionValid(product) {
    const { promotion } = product;
    if (!promotion) return false;
    const promotionInstance =
      this.inventoryService.getPromotionsByName(promotion);
    if (!promotionInstance) return false;
    return promotionInstance.checkPromotionPeriod();
  }

  // 3
  async #handlePromotionResult(promotionResult, product, quantity) {
    if (promotionResult.partialPromotion) {
      const userResponse =
        await this.inputView.getUserConfirmationWithoutPromotion(
          product.name,
          promotionResult.remainingQuantity,
        );
      const isConfirmed = userResponse === 'Y';
      const freeItems =
        quantity > product.quantity
          ? Math.floor(
              product.quantity /
                (promotionResult.buyAmount + promotionResult.freeAmount),
            ) * promotionResult.freeAmount
          : promotionResult.maxFreeItems;
      return isConfirmed
        ? [{ product, quantity, freeItems }]
        : [{ product, quantity: 0, freeItems: 0 }];
    }

    if (promotionResult.extraRequired) {
      const userResponse =
        await this.inputView.getUserconfirmAdditionalPurchase(
          product.name,
          promotionResult.extraRequired,
        );
      const extraConfirmed = userResponse === 'Y';
      const freeItems = extraConfirmed
        ? promotionResult.maxFreeItems
        : // Math.floor(
          //     (quantity + promotionResult.extraRequired) /
          //       promotionResult.buyAmount,
          //   ) * promotionResult.freeAmount
          Math.floor(
            quantity / (promotionResult.buyAmount + promotionResult.freeAmount),
          ) * promotionResult.freeAmount;
      Console.print(`freeItems: ${freeItems}`);
      return [
        {
          product,
          quantity:
            quantity + (extraConfirmed ? promotionResult.extraRequired : 0),
          freeItems,
        },
      ];
    }
    return [{ product, quantity, freeItems: promotionResult.maxFreeItems }];
  }

  // 2
  async #processSingleItemWithPromotion(item) {
    const { name, quantity } = item;
    // const products = this.inventoryService.getProductsByName(name);
    const products = this.inventoryService.getProductsCombinedQuantity(name);
    const productWithPromotion = products.find((p) => p.promotion);
    if (productWithPromotion && this.#isPromotionValid(productWithPromotion)) {
      const promotion = this.inventoryService.getPromotionsByName(
        productWithPromotion.promotion,
      );
      Console.print(`quantity 이게 뭐람
         : ${quantity}`);
      const promotionResult = this.checkoutService.isPromotionApplicable(
        productWithPromotion,
        promotion.buyAmount,
        promotion.freeAmount,
        quantity,
      );
      // eslint-disable-next-line no-return-await
      const result = await this.#handlePromotionResult(
        promotionResult,
        productWithPromotion,
        quantity,
      );
      return result;
    }
    return [{ product: products[0], quantity }];
  }

  // 1
  async #processItemsWithpromotion(items) {
    // return items.flatMap((item) => this.#processSingleItemWithPromotion(item));
    const processedItems = await Promise.all(
      items.map(
        // eslint-disable-next-line no-return-await
        async (item) => await this.#processSingleItemWithPromotion(item),
      ),
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
