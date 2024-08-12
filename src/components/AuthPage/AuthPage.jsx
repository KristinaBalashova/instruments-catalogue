import { useState, useEffect, useContext } from 'react';
import { supabase } from '../../supabaseClient';
import { UserContext } from '../../context/context';
import Button from '../Button/Button';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [session, setSession] = useState('');

  /*
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);
  */
  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      //setUser(data.user);
      setError('');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
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
              <h2 className={styles.formTitle}>Welcome to InLib!</h2>
              <div>
                {isSignUp ? (
                  <p>
                    Already have an account?{' '}
                    <span onClick={() => setIsSignUp(false)} className={styles.link}>
                      Sign In
                    </span>
                  </p>
                ) : (
                  <p>
                    Don’t have an account?{' '}
                    <span onClick={() => setIsSignUp(true)} className={styles.link}>
                      Sign Up
                    </span>
                  </p>
                )}
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <Button primary type="submit">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
          </div>
        ) : (
          <div className={styles.insideContainer}>
            <p className={styles.text}>You are logged in as</p>
            <p className={styles.email}>{session.user.email}</p>
            <Button secondary onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
