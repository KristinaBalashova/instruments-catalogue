import styles from './Input.module.css';
import cx from 'classnames';

const Input = ({ label, type, id, value, onChange, error, required = false }) => {

  const errorMessage = error?.message;
  
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <label htmlFor={label} className={cx(styles.label, error && styles.error)}>
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={cx(styles.input, error && styles.error)}
          required={required}
        />
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Input;
