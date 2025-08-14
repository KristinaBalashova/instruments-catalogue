import { RxCross2 } from 'react-icons/rx';
import { FcCheckmark } from 'react-icons/fc';
import { STATUS_SUCCESS, STATUS_FAIL } from '../../../strings';
import styles from './StatusInfo.module.css';
import cx from 'classnames';

const StatusInfo = ({ children, status = 'info', mainPageLink = false, ...props }) => {
  return (
    <div
      className={cx(
        styles.info,
        status === STATUS_SUCCESS && styles.success,
        status === STATUS_FAIL && styles.fail,
      )}
      aria-live="polite"
      {...props}
    >
      {status === STATUS_SUCCESS && <FcCheckmark />}
      {status === STATUS_FAIL && <RxCross2 className={styles.failIcon} />}
      {children}
    </div>
  );
};

export default StatusInfo;
