import React from 'react';
import cx from 'classnames';

import styles from './Button.module.css';

const Button = ({ children, onClick, secondary, className, disabled = false }) => {
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
