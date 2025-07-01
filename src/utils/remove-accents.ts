export const removeAccents = (str: string) => {
  if (!str) return '';

  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks
    .replace(/[đ]/g, 'd'); // Replace 'đ' with 'd'
};
