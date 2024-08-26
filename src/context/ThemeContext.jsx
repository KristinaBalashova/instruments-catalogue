import { createContext, useState } from 'react';
import { THEME_LIGHT } from './../strings';

export const ThemeContext = createContext(THEME_LIGHT);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEME_LIGHT);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
