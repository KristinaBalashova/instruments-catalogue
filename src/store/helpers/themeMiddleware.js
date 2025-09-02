export const themeMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === 'theme/toggleTheme') {
    const theme = store.getState().theme.value;
    localStorage.setItem('theme',  JSON.stringify(theme));
  }

  return result;
};