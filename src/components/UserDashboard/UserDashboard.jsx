import styles from './UserDashboard.module.css';
import { strings } from '../../strings';
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
      <p className={styles.text}>{strings.currentlyLogedIn}</p>
      <p className={styles.email}>{email}</p>
      <Button secondary onClick={handleSignOut}>
        {strings.signOut}
      </Button>
    </div>
  );
};

export default UserDashboard;
