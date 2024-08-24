import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { USER_MESSAGES } from '../../strings';
import { ThemeContext, UserContext } from '../../context';
import { Button } from '..';
import { InstrumentsCatalogue } from '../../containers';
import cx from 'classnames';
import styles from './MainPage.module.css';

const MainPage = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

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
