import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { USER_MESSAGES } from '../../strings';
import { ThemeContext, UserContext } from '../../context/context';
import { supabase } from '../../helpers/supabaseClient';
import { Button } from '../';
import { InstrumentsCatalogue } from '../../containers';
import { getUserData } from '../../api/api';
import cx from 'classnames';
import styles from './MainPage.module.css';

const MainPage = () => {
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          const { data, error } = await getUserData(session.user.id);

          if (error) throw error;

          if (data) {
            setUser({
              id: session.user.id,
              role: data.role,
            });
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      const fetchUserData = async () => {
        if (session) {
          const { data, error } = await getUserData(session.user.id);

          if (error) throw error;

          if (data) {
            setUser({
              id: session.user.id,
              role: data.role,
            });
          }
        }
      };
      fetchUserData();
    }
    if (event === 'SIGNED_OUT') {
      setUser(null);
    }
  });

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <h1 className={styles.headline}>{USER_MESSAGES.TITLE}</h1>
          <p className={styles.description}>{USER_MESSAGES.DESCRIPTION}</p>
          <div className={styles.auth}>
            {user?.role === 'admin' && (
              <Link to="/instrument-creator">
                <Button>{USER_MESSAGES.ADD_INSTRUMENT}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <InstrumentsCatalogue />
    </section>
  );
};

export default MainPage;
