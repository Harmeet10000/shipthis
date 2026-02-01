export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};