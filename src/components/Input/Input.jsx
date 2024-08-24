import React from 'react';
import cx from 'classnames';
import styles from './Input.module.css';

const Input = ({
  disabled = false,
  name,
  onChange,
  placeholder = null,
  readOnly = false,
  required = false,
  type,
  value,
  label = null,
  error,
  autocomplete = '',
  id,
}) => {
  const inputRef = React.useRef(null);

  const handleClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={styles.root}>
      <div className={styles.container} onClick={handleClick}>
        {label && (
          <label htmlFor={id} className={cx(styles.label, error && styles.error)}>
            {label}
          </label>
        )}
        <input
          ref={inputRef}
          aria-label={name}
          data-testid={name}
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          className={cx(styles.input, error && styles.error, disabled && styles.disabled)}
          autoComplete={autocomplete}
          required={required}
        />
      </div>
    </div>
  );
};

export default Input;
