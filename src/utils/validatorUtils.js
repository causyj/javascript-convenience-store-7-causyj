export const isValidatePositiveInteger = (number) => {
  return (
    !Number.isNaN(Number(number)) &&
    Number.isInteger(Number(number)) &&
    Number(number) >= 0
  );
};

export const isValidateNameString = (name) => {
  return typeof name === 'string' && name.trim() !== '';
};
export const isValidateNameFormat = (name) => {
  return /^[a-zA-Z\s가-힣]+$/.test(name);
};
export const isValidatePromotionString = (value) => {
  return typeof value === 'string';
};
