import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import { loadTheme } from './helpers/loadTheme';
import { themeMiddleware } from './helpers/themeMiddleware';

 const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
  preloadedState: loadTheme(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(themeMiddleware),
});

export default store;