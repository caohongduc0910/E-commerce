export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const calculateTotalPages = (limit: number, total: number): number => {
  return Math.ceil(total / limit);
};
