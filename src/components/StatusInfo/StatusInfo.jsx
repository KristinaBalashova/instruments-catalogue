import styles from './StatusInfo.module.css';

export const StatusInfo = ({ children, status }) => {
  return (
    <div className={styles.wrap}>
      {status === 'success' ? (
        <div className={styles.success}>{children}</div>
      ) : (
        <div className={styles.fail}>{children}</div>
      )}
    </div>
  );
};
