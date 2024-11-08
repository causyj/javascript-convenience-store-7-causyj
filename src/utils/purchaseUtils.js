export const parsePurchaseInput = (item) => {
  const [name, quantity] = item
    .replace(/\[|\]/g, '')
    .split('-')
    .map((value) => value.trim());
  return { name, quantity };
};
