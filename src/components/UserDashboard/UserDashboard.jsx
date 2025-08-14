import styles from './UserDashboard.module.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { USER_MESSAGES } from '../../strings';
import { Button } from '../ui';
import { UserContext } from '../../context';

const UserDashboard = ({ handleSignOut }) => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <p className={styles.text}>{USER_MESSAGES.CURRENTLY_LOGGED_IN}</p>
      <p className={styles.email}>{user?.email}</p>
      <div className={styles.buttons}>
        <Button secondary onClick={handleSignOut}>
          {USER_MESSAGES.SIGN_OUT}
        </Button>
        <Link to="/" className={styles.link}>
          <Button primary>{USER_MESSAGES.RETURN}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
