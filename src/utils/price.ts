export const formatPrice = (value: number): string => {
  const formatted = new Intl.NumberFormat("en-US").format(value);
  return `${formatted} جنيه`;
};

export const getDiscountPercent = (
  price: number,
  oldPrice?: number,
): number | undefined => {
  if (!oldPrice || oldPrice <= price) {
    return undefined;
  }

  return Math.round(((oldPrice - price) / oldPrice) * 100);
};
