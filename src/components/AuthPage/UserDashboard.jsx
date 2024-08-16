import styles from './UserDashboard.module.css';
import { strings } from '../../strings';
import Button from '../Button/Button';
const UserDashboard = ({ userEmail, handleSignOut }) => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>{strings.currentlyLogedIn}</p>
      <p className={styles.email}>{userEmail}</p>
      <Button secondary onClick={handleSignOut}>
        {strings.signOut}
      </Button>
    </div>
  );
};

export default UserDashboard;
