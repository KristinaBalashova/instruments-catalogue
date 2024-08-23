import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { supabase } from '../../helpers/supabaseClient';
import { USER_MESSAGES } from '../../strings';
import { ThemeContext, UserContext } from '../../context/context';
import { Button, UserDashboard, SignForm } from '../../components';
import styles from './AuthPage.module.css';
import cx from 'classnames';

const AuthPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [confirmationCheck, setConfirmationCheck] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (confirmationCheck) {
      const interval = setInterval(async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user && data.user.email_confirmed_at) {
          setIsConfirmed(true);
          setUser(data.user);
          clearInterval(interval);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [confirmationCheck, setUser]);

  const handleSignIn = async (email, password, setError) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async (email, password, setError) => {
    const { error, data } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setConfirmationCheck(true);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  };

  const handleResend = async (email) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        {!user && !confirmationCheck && (
          <SignForm handleSignIn={handleSignIn} handleSignUp={handleSignUp} />
        )}
        {confirmationCheck && !isConfirmed && (
          <div>
            <p>{`Check your email. If you didn't get a confirmation letter, click here to resend`}</p>
            <Button secondary onClick={() => handleResend(email)}>
              {'Resend'}
            </Button>
            <Link to="/" className={styles.link}>
              <Button primary>{USER_MESSAGES.RETURN}</Button>
            </Link>
          </div>
        )}
        {isConfirmed || (user && <UserDashboard user={user} handleSignOut={handleSignOut} />)}
      </div>
    </div>
  );
};

export default AuthPage;
