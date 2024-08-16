import React from 'react';
import styles from './Button.module.css';
import cx from 'classnames';

const Button = ({ children, onClick, primary, secondary, className, disabled = false }) => {
  return (
    <button
      className={cx(
        styles.button,
        secondary ? styles.secondary : styles.primary,
        className,
        { [styles.disabled]: disabled }, // Apply the disabled style if the button is disabled
      )}
      type="submit"
      onClick={onClick}
      disabled={disabled} // Ensure the button is actually disabled in the browser
    >
      {children}
    </button>
  );
};

export default Button;
