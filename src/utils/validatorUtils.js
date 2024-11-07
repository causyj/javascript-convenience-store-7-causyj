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

export const isValidateDateFormat = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};
