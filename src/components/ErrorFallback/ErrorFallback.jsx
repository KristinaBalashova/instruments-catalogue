import styles from './ErrorFallback.module.css';
import { SERVER_MESSAGES, USER_MESSAGES } from '../../strings';
import { Button } from '../ui';

const ErrorFallback = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{SERVER_MESSAGES.ERRORS.ERROR}</h1>
      <Button secondary onClick={() => window.location.reload()}>
        {USER_MESSAGES.RELOAD}
      </Button>
    </div>
  );
};

export default ErrorFallback;
