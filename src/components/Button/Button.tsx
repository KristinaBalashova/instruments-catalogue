import React from 'react';
import styles from './Button.module.css';

const Button = ({ children }) => {
  return (
    <button className={styles.button} type="submit">
      {children}
    </button>
  );
};

export default Button;
