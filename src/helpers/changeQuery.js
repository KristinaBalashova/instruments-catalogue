export const setQuery = (key, params, location, navigate) => {
  const searchParams = new URLSearchParams(location.search);
  searchParams.set(key, params);
  navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
};

export const deleteQuery = (key, location, navigate) => {
  const searchParams = new URLSearchParams(location.search);
  searchParams.delete(key);
  navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
};
