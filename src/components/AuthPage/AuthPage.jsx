import React, { useState, useContext, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { UserContext } from '../../context/context';
import Button from '../Button/Button';
import styles from './AuthPage.module.css';
import { strings } from '../../strings';
import UserDashboard from './UserDashboard';
import Input from '../Input/Input';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const isValidDomain = (email) => {
  const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const domain = email.split('@')[1];
  return domainPattern.test(domain);
};

const authSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .refine((email) => isValidDomain(email), { message: 'Invalid email domain' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmationCheck, setConfirmationCheck] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors.map((err) => err.message).join(', '));
      return false;
    }
    setError('');
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { error, data } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setConfirmationCheck(true);
      setError('');
      setIsSignUp(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      setUser(null);
      setEmail('');
      setPassword('');
    }
  };
  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
  };
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

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {!user && !confirmationCheck && (
          <div className={styles.authForm}>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className={styles.form}>
              <h2 className={styles.formTitle}>{strings.welcome}</h2>
              <div>
                {isSignUp ? (
                  <p>
                    {strings.doHaveAccount}{' '}
                    <span onClick={() => setIsSignUp(false)} className={styles.link}>
                      {strings.signIn}
                    </span>
                  </p>
                ) : (
                  <p>
                    {strings.notHaveAccount}{' '}
                    <span onClick={() => setIsSignUp(true)} className={styles.link}>
                      {strings.signUp}
                    </span>
                  </p>
                )}
              </div>
              <Input
                label={strings.email}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={error}
                placeholder="email"
                autocomplete="email"
              />
              <Input
                label={strings.password}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={error}
                placeholder="password"
                autocomplete="current-password"
              />
              <Button primary type="submit">
                {isSignUp ? strings.signUp : strings.signIn}
              </Button>
              {error && <p className={styles.error}>{error}</p>}
            </form>
          </div>
        )}
        {confirmationCheck && !isConfirmed && (
          <div>
            <p>{`Check you email ${email}! If you didnt get a confirmation letter, click here to resend`}</p>
            <Button secondary onClick={handleResend}>
              {'Resend'}
            </Button>
            <Link to="/">
              <Button sprimary onClick={handleResend}>
                {'Return to the main page'}
              </Button>
            </Link>
          </div>
        )}
        {isConfirmed || (user && <UserDashboard user={user} handleSignOut={handleSignOut} />)}
      </div>
    </div>
  );
};

export default AuthPage;
