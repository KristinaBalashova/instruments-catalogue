
import { RxCross2 } from "react-icons/rx";
import { FcCheckmark } from "react-icons/fc";

import styles from './StatusInfo.module.css';
import cx from 'classnames';

const StatusInfo = ({ children, status='info', mainPageLink=false, ...props }) => {
  return (
    <div
      className={cx(
        styles.info,
        status === 'success' && styles.success,
        status === 'fail' && styles.fail
      )}
      aria-live="polite"
      {...props}
    >
        {status === 'success' && <FcCheckmark />}
        {status === 'fail' && <RxCross2 className={styles.failIcon} />}
        {children}
    </div>
  );
};

export default StatusInfo;