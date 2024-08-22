import React, { useState, useContext, useEffect } from 'react';
import { z } from 'zod';
import { Link } from 'react-router-dom';

import { supabase } from '../../helpers/supabaseClient';
import { strings } from '../../strings';
import { ThemeContext, UserContext } from '../../context/context';
import { isValidDomain } from '../../helpers/isValidDomain';

import { Button, UserDashboard, SignForm } from '../../components';

import styles from './AuthPage.module.css';
import cx from 'classnames';

const authSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .refine((email) => isValidDomain(email), { message: 'Invalid email domain' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const AuthPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
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

  const validateForm = (email, password) => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors.map((err) => err.message).join(', '));
      return false;
    }
    setError('');
    return true;
  };

  const handleSignIn = async (e, email, password) => {
    e.preventDefault();
    if (!validateForm(email, password)) return;

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleSignUp = async (e, email, password) => {
    e.preventDefault();
    if (!validateForm(email, password)) return;

    const { error, data } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setConfirmationCheck(true);
      setError('');
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      setUser(null);
    }
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) {
      alert(error);
    }
  };

  return (
    <div className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        {!user && !confirmationCheck && (
          <SignForm handleSignIn={handleSignIn} handleSignUp={handleSignUp} error={error} />
        )}
        {confirmationCheck && !isConfirmed && (
          <div>
            <p>{`Check you email ${email}. If you didnt get a confirmation letter, click here to resend`}</p>
            <Button secondary onClick={handleResend}>
              {'Resend'}
            </Button>
            <Link to="/" className={styles.link}>
              <Button primary>{strings.return}</Button>
            </Link>
          </div>
        )}
        {isConfirmed || (user && <UserDashboard user={user} handleSignOut={handleSignOut} />)}
      </div>
    </div>
  );
};

export default AuthPage;
