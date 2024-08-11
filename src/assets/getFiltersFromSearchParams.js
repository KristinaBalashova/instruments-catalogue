export const getFiltersFromSearchParams = (searchParams) => {
  const filters = {};
  for (const [key, value] of searchParams.entries()) {
    filters[key] = value;
  }
  return filters;
};
