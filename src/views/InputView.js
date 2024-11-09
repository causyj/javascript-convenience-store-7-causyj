import { Console } from '@woowacourse/mission-utils';

class InputView {
  async getUserPurchaseInput() {
    const input = await Console.readLineAsync(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1]) \n',
    );
    return input;
  }

  async getUserConfirmationWithoutPromotion(productName, quantity) {
    const input = await Console.readLineAsync(
      `현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N) \n`,
    );
    return input;
  }

  async getUserconfirmAdditionalPurchase(productName, quantity) {
    const input = await Console.readLineAsync(
      `\n현재 ${productName}은(는) ${quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N) \n`,
    );
    return input;
  }

  async getUserMembershipInput() {
    const input = await Console.readLineAsync(
      '멤버십 할인을 받으시겠습니까? (Y/N) \n',
    );
    return input;
  }
}
export default InputView;
