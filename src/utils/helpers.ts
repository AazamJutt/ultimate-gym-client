export const capitalize = (str: string | undefined): string => {
  if (!str?.length) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const formatCnic = (value: string) => {
  // Remove any non-digit characters
  const digits = value.replace(/\D/g, '');

  // Format to 'xxxxx-xxxxxxx-x'
  const match = digits.match(/^(\d{1,5})(\d{0,7})(\d{0,1})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  }

  return value;
};
