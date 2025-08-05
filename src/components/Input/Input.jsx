import React from 'react';
import cx from 'classnames';
import styles from './Input.module.css';

const Input = ({
  disabled = false,
  name,
  onChange,
  placeholder = '',
  readOnly = false,
  required = false,
  type = 'text',
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
      {label && (
        <label htmlFor={id} className={cx(styles.label, error && styles.labelError)}>
          {label}
        </label>
      )}
      <div className={cx(styles.container, disabled && styles.disabled)} onClick={handleClick}>
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
          className={cx(styles.input, error && styles.inputError)}
          autoComplete={autocomplete}
          required={required}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;