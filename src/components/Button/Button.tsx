import React from 'react';
import styles from './Button.module.css';
import cx from 'classnames';

const Button = ({ children, onClick, primary, secondary, className }) => {
  return (
    <button
      className={cx(styles.button, secondary ? styles.secondary : styles.primary, className)}
      type="submit"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
