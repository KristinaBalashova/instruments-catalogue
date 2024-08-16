import styles from './Input.module.css';
import cx from 'classnames';

const Input = ({
  label = null,
  type,
  id = null,
  value,
  onChange,
  error,
  required = false,
  placeholder = null,
  disabled = false,
}) => {
  const errorMessage = error?.message;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {label && (
          <label htmlFor={label} className={cx(styles.label, error && styles.error)}>
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
        />
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Input;
