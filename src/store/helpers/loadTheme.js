export const loadTheme = () => {
  try {
    const serializedTheme = localStorage.getItem('theme');
    if (serializedTheme === null) {
      return undefined;
    }
    return { theme: { value: JSON.parse(serializedTheme) } };
  } catch (err) {
    console.error("Could not load theme from localStorage", err);
    return undefined;
  }
};