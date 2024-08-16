import { Link } from 'react-router-dom';
import { strings } from '../../strings';
import styles from './StatusInfo.module.css';

export const StatusInfo = ({ children, status }) => {
  return (
    <div className={styles.container}>
      {status === 'success' ? (
        <div className={styles.success}>{children}</div>
      ) : (
        <div className={styles.fail}>
          {children}
          <Link to="/">{strings.return}</Link>
        </div>
      )}
    </div>
  );
};

export default StatusInfo;
