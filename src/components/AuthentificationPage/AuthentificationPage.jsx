import { useState, useEffect, useContext } from 'react';
import { supabase } from '../../supabaseClient';
import { UserContext } from '../../context/context';
import Button from '../Button/Button';
import styles from './AuthentificationPage.module.css';

const AuthentificationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, setUser } = useContext(UserContext);
  const [session, setSession] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
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
      setIsSignUp(false); // Switch back to sign-in mode after successful sign-up
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

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {!session ? (
          <div className={styles.authForm}>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className={styles.signInForm}>
              <h2 className={styles.formTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.vintageInput}
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
                  className={styles.vintageInput}
                  required
                />
              </div>
              <Button primary type="submit">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
              <p>
                {isSignUp ? (
                  <span>
                    Already have an account?{' '}
                    <Button secondary onClick={() => setIsSignUp(false)}>
                      Sign In
                    </Button>
                  </span>
                ) : (
                  <span>
                    Don’t have an account?{' '}
                    <Button secondary Click={() => setIsSignUp(true)}>
                      Sign Up
                    </Button>
                  </span>
                )}
              </p>
            </form>
          </div>
        ) : (
          <div className={styles.signedIn}>
            <p>You are logged in as {session.user.email}</p>
            <Button secondary onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthentificationPage;
