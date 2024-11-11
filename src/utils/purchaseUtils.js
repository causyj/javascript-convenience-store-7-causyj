export const parsePurchaseInput = (item) => {
  const [name, quantity] = item
    .replace(/\[|\]/g, '')
    .split('-')
    .map((value) => value.trim());
  return { name, quantity };
};
export const calulateFreeItemCnt = (numerator, buyAmount, freeAmount) => {
  return Math.floor(numerator / (buyAmount + freeAmount)) * Number(freeAmount);
};
