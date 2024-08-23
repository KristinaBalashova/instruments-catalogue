import React, { useState, useContext, useEffect } from 'react';
import { supabase } from '../../helpers/supabaseClient';
import { ThemeContext, UserContext } from '../../context/context';
import { UserDashboard, SignForm, StatusInfo } from '../../components';
import styles from './AuthPage.module.css';
import cx from 'classnames';
import ConfirmationCheck from '../../components/ConfirmationCheck/ConfirmationCheck';

const AuthPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [confirmationCheck, setConfirmationCheck] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (confirmationCheck) {
      const interval = setInterval(async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user && data.user.email_confirmed_at) {
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
      setError(error.message);
    }
  };

  const handleResend = async (email) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        {!user && !confirmationCheck && (
          <SignForm handleSignIn={handleSignIn} handleSignUp={handleSignUp} />
        )}
        {confirmationCheck && !user && <ConfirmationCheck handleResend={handleResend} />}
        {user && <UserDashboard user={user} handleSignOut={handleSignOut} />}
        {error && <StatusInfo status="fail">{error}</StatusInfo>}
      </div>
    </div>
  );
};

export default AuthPage;
