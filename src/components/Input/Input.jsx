import cx from 'classnames';
import styles from './Input.module.css';

const Input = ({
  label = null,
  type,
  id = null,
  value = '',
  onChange,
  error,
  required = false,
  placeholder = null,
  disabled = false,
  autocomplete = '',
}) => {
  const errorMessage = error?.message;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {label && (
          <label htmlFor={id} className={cx(styles.label, error && styles.error)}>
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={cx(styles.input, error && styles.error, disabled && styles.disabled)}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autocomplete}
        />
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Input;
