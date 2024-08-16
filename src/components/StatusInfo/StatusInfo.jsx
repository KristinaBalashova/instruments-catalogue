import styles from './StatusInfo.module.css';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

export const StatusInfo = ({ children, status }) => {
  return (
    <div className={styles.wrap}>
      {status === 'success' ? (
        <div className={styles.success}>{children}</div>
      ) : (
        <div className={styles.fail}>
          {children}
          <Link to="/">
              'Return to the main page'
            </Link>
          </div>
      )}
    </div>
  );
};
