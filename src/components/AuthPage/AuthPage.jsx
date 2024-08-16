import React, { useState, useContext } from 'react';
import { supabase } from '../../supabaseClient';
import { UserContext } from '../../context/context';
import Button from '../Button/Button';
import styles from './AuthPage.module.css';
import { strings } from '../../strings';
import UserDashboard from './UserDashboard';
import Input from '../Input/Input';
import { z } from 'zod';

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
  const { setUser } = useContext(UserContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [session, setSession] = useState('');

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
      setError('');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { error, data } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
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

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {!session ? (
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
              />
              <Input
                label={strings.password}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={error}
              />
              <Button primary type="submit">
                {isSignUp ? strings.signUp : strings.signIn}
              </Button>
            </form>
          </div>
        ) : (
          <UserDashboard userEmail={session.user.email} handleSignOut={handleSignOut} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
