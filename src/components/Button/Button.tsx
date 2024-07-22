import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick}) => {
  return (
    <button className={styles.button} type="submit" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
