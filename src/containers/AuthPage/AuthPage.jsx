import React, { useState, useContext, useEffect } from 'react';
import cx from 'classnames';

import { supabase } from '../../helpers/supabaseClient';
import { ThemeContext, UserContext } from '../../context';

import { UserDashboard, SignForm, StatusInfo, Loader } from '../../components';
import ConfirmationCheck from '../../components/ConfirmationCheck/ConfirmationCheck';

import styles from './AuthPage.module.css';

const AuthPage = () => {
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const [confirmationCheck, setConfirmationCheck] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (email, password, setError) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setConfirmationCheck(true);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleResend = async (email) => {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        {loading && <Loader />}
        {!user && !confirmationCheck && (
          <SignForm handleSignIn={handleSignIn} handleSignUp={handleSignUp} />
        )}
        {confirmationCheck && !user && <ConfirmationCheck handleResend={handleResend} />}
        {user && <UserDashboard user={user} handleSignOut={handleSignOut} />}
        {error && <StatusInfo status="fail">{error}</StatusInfo>}
      </div>
    </section>
  );
};

export default AuthPage;
