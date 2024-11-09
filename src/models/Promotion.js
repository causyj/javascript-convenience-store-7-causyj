import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  constructor(name, buyAmount, freeAmount, startDate, endDate) {
    this.name = name;
    this.buyAmount = buyAmount;
    this.freeAmount = freeAmount;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  checkPromotionPeriod() {
    const currentDate = DateTimes.now();
    return (
      currentDate >= new Date(this.startDate) &&
      currentDate <= new Date(this.endDate)
    );
  }
}

export default Promotion;
