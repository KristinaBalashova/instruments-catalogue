import { createContext, useState, useEffect } from 'react';
import { THEME_LIGHT, THEME_DARK } from './../strings';

export const ThemeContext = createContext(THEME_LIGHT);

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : THEME_LIGHT;
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
