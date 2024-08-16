import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { strings } from '../../strings';
import { ThemeContext, UserContext } from '../../context/context';

import Button from '../Button/Button';
import InstrumentsCatalogue from '../InstrumentsCatalogue/InstrumentsCatalogue';

import cx from 'classnames';

import styles from './MainPage.module.css';

const MainPage = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <h1 className={styles.headline}>{strings.title}</h1>
            <p className={styles.description}>{strings.description}</p>
            <div className={styles.auth}>
              {user?.role === 'admin' && (
                <Link to="/instrument-creator">
                  <Button>{strings.addInstrument}</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <InstrumentsCatalogue />
    </>
  );
};

export default MainPage;
