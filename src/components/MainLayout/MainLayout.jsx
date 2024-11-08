import React, { useContext } from 'react';
import cx from 'classnames';

import { ThemeContext } from '../../context';
import { Header } from '..';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
