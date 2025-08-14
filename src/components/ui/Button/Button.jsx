import cx from 'classnames';
import styles from './Button.module.css';

const Button = ({ children, onClick, secondary, className, disabled = false }) => {
  return (
    <button
      className={cx(styles.button, secondary ? styles.secondary : styles.primary, className, {
        [styles.disabled]: disabled,
      })}
      type="submit"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
