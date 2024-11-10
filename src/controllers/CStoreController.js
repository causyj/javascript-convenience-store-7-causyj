/* eslint-disable max-lines-per-function */
import { Console } from "@woowacourse/mission-utils";
import InventoryService from "../servieces/InventoryService.js";
import InputView from "../views/InputView.js";
import OutputView from "../views/OutputView.js";
import InputValidator from "../validators/InputValidator.js";
import CheckoutService from "../servieces/CheckoutService.js";
import UserInputItem from "../models/UserInputItem.js";

class CStoreController {
  constructor() {
    this.inventoryService = new InventoryService();
    this.outputView = new OutputView();
    this.inputView = new InputView();
    this.checkoutService = new CheckoutService();
  }

  async #safeInput(input, onError) {
    try {
      return await input();
    } catch (error) {
      Console.print(error.message);
      return await onError();
    }
  }

  async start() {
    this.#printProductList();
    const purchaseItems = await this.#getUserPurchaseItems();
    const finalItems = await this.#processPromotion(purchaseItems);
    this.#updateStock(finalItems);
    await this.#checkoutAndPrintReceipt(finalItems, purchaseItems);
    await this.#askForMoreShopping();
  }

  async #askForMoreShopping() {
    await this.#safeInput(
      async () => {
        const additionalShopping = await this.inputView.askForMorePurchase();
        InputValidator.validateYesNoInput(additionalShopping);
        if (additionalShopping.trim().toUpperCase() === "Y") {
          await this.start();
        }
      },
      async () => await this.#askForMoreShopping()
    );
  }

  async #checkoutAndPrintReceipt(finalItems, purchaseItems) {
    const finalBill = this.checkoutService.calculateFinalPrices(finalItems);
    if (finalBill.every((item) => item.finalPrice === 0)) {
      return;
    }
    const membershipDiscount = await this.#applyMembershipDiscount(finalBill);
    this.outputView.printFinalReceipt(
      purchaseItems,
      finalBill,
      membershipDiscount || 0
    );
  }

  // #updateStock(finalItems) {
  //   finalItems.forEach(({ product, purchasedQty }) => {
  //     product.reduceStock(purchasedQty);
  //   });
  // }
  #updateStock(finalItems) {
    finalItems.forEach(({ product, purchasedQty }) => {
      product.reduceStock(purchasedQty);
    });
    this.inventoryService.updateProducts(finalItems);
  }

  async #applyMembershipDiscount(finalBill) {
    return await this.#safeInput(
      async () => {
        const membershipInput = await this.inputView.getUserMembershipInput();
        const isMember = membershipInput.trim().toUpperCase() === "Y";
        InputValidator.validateYesNoInput(membershipInput);
        if (!isMember) return 0;
        return this.checkoutService.calculateMembershipDiscount(finalBill);
      },
      async () => {
        return await this.#applyMembershipDiscount(finalBill);
      }
    );
  }

  // 3
  async #handlePromotionResult(promotionResult, product, purchaseItem) {
    if (promotionResult.partialPromotion) {
      return await this.#partialPromotion(
        promotionResult,
        product,
        purchaseItem
      );
    }
    if (promotionResult.extraRequired) {
      return await this.#extraRequiredPromotion(
        promotionResult,
        product,
        purchaseItem
      );
    }
    return [
      {
        product,
        purchasedQty: purchaseItem.purchasedQty,
        freeItems: promotionResult.maxFreeItems,
      },
    ];
  }

  //
  async #partialPromotion(promotionResult, product, purchaseItem) {
    const isConfirmed = await this.#confirmWithoutPromotion(
      product,
      promotionResult
    );
    return this.#partialPromotionResult(
      isConfirmed,
      promotionResult,
      product,
      purchaseItem
    );
  }

  // eslint-disable-next-line max-lines-per-function
  async #confirmWithoutPromotion(product, promotionResult) {
    return await this.#safeInput(
      async () => {
        return await this.#confirmationWithoutPromotion(
          product,
          promotionResult
        );
      },
      async () => {
        return await this.#confirmWithoutPromotion(product, promotionResult);
      }
    );
  }

  async #confirmationWithoutPromotion(product, promotionResult) {
    const userResponse =
      await this.inputView.getUserConfirmationWithoutPromotion(
        product.name,
        promotionResult.remainingQuantity
      );
    InputValidator.validateYesNoInput(userResponse);
    return userResponse.trim().toUpperCase() === "Y";
  }

  #partialPromotionResult(isConfirmed, promotionResult, product, purchaseItem) {
    const freeItems = !isConfirmed
      ? 0
      : this.checkoutService.calculateFreeItems(
          product,
          promotionResult,
          purchaseItem.purchasedQty
        );
    if (!isConfirmed) {
      purchaseItem.cancelPurchase();
    }
    return [{ product, purchasedQty: purchaseItem.purchasedQty, freeItems }];
  }
  //

  async #extraRequiredPromotion(promotionResult, product, purchaseItem) {
    const extraConfirmed = await this.#confirmAdditionalPurchase(
      product,
      promotionResult
    );
    if (extraConfirmed && promotionResult.extraRequired) {
      purchaseItem.increasePurchaseQuantity(promotionResult.extraRequired);
    }
    return this.#finalPromotionResult(
      promotionResult,
      product,
      purchaseItem.purchasedQty,
      extraConfirmed
    );
  }

  async #confirmAdditionalPurchase(product, promotionResult) {
    return await this.#safeInput(
      async () => {
        return await this.#getUserAdditionalConfirmation(
          product,
          promotionResult
        );
      },
      async () => {
        return await this.#confirmAdditionalPurchase(product, promotionResult);
      }
    );
  }

  async #getUserAdditionalConfirmation(product, promotionResult) {
    const userResponse = await this.inputView.getUserConfirmAdditionalPurchase(
      product.name,
      promotionResult.extraRequired
    );
    InputValidator.validateYesNoInput(userResponse);
    return userResponse.trim().toUpperCase() === "Y";
  }

  #finalPromotionResult(
    promotionResult,
    product,
    purchasedQty,
    extraConfirmed
  ) {
    const freeItems = this.checkoutService.calculateFreeItemsWithConfirmation(
      extraConfirmed,
      promotionResult,
      purchasedQty
    );
    return [{ product, purchasedQty, freeItems }];
  }

  #isPromotionValid(product) {
    const promotionInstance = this.inventoryService.getPromotionsByName(
      product.promotion
    );
    if (!promotionInstance) return false;
    return promotionInstance.checkPromotionPeriod();
  }

  // 2
  async #processSingleItemWithPromotion(purchaseItem) {
    const product = this.inventoryService.getCombinedQuantity(
      purchaseItem.purchasedName
    );
    if (product.promotion !== "" && this.#isPromotionValid(product)) {
      return await this.#getPromotionResult(purchaseItem, product);
    }
    return [{ product, purchasedQty: purchaseItem.purchasedQty }];
  }

  async #getPromotionResult(purchaseItem, products) {
    const promotionDetails = this.#fetchPromotionDetails(products.promotion);
    const promotionResult = this.#evaluatePromotionApplicability(
      purchaseItem,
      promotionDetails,
      products
    );
    return await this.#handlePromotionResult(
      promotionResult,
      products,
      purchaseItem
    );
  }

  #fetchPromotionDetails(promotionName) {
    return this.inventoryService.getPromotionsByName(promotionName);
  }

  #evaluatePromotionApplicability(purchaseItem, promotionDetails, products) {
    return this.checkoutService.isPromotionApplicable(
      purchaseItem,
      promotionDetails.buyAmount,
      promotionDetails.freeAmount,
      products
    );
  }

  // 1
  async #processPromotion(purchaseItems) {
    const processedItems = await Promise.all(
      purchaseItems.map(async (purchaseItem) =>
        this.#processSingleItemWithPromotion(purchaseItem)
      )
    );
    return processedItems.flat();
  }

  #printProductList() {
    const productList = this.inventoryService.getAllProducts();
    this.outputView.printProductList(productList);
  }

  async #getUserPurchaseItems() {
    return await this.#safeInput(
      async () => {
        const userPurchaseInput = await this.inputView.getUserPurchaseInput();
        return this.#parseUserPurchaseInput(userPurchaseInput);
      },
      async () => {
        return await this.#getUserPurchaseItems();
      }
    );
  }

  #parseUserPurchaseInput(input) {
    return input.split(/\s*,\s*/).map((item) => this.#parseItem(item));
  }

  #parseItem(item) {
    InputValidator.validateUserPurchaseInput(item);
    const [name, quantity] = item.slice(1, -1).split("-");
    InputValidator.validateProduct(
      name,
      Number(quantity),
      this.inventoryService.getProductsNameList(),
      this.inventoryService.getProductQuantity(name)
    );
    return new UserInputItem(name, Number(quantity));
  }
}
export default CStoreController;
