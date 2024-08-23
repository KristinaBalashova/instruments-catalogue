import styles from './UserDashboard.module.css';
import { Link } from 'react-router-dom';
import { USER_MESSAGES } from '../../strings';
import { Button } from '../';
import { useState, useEffect } from 'react';
import { supabase } from '../../helpers/supabaseClient';

const UserDashboard = ({ handleSignOut }) => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }
        if (user) {
          setEmail(user.email);
        } else {
          console.log('No user is currently authenticated.');
          return null;
        }
      } catch (error) {
        console.error('Error fetching user email:', error.message);
        return null;
      }
    };

    getUserData();
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.text}>{USER_MESSAGES.CURRENTLY_LOGGED_IN}</p>
      <p className={styles.email}>{email}</p>
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
