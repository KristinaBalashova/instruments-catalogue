import styles from './MainPage.module.css';
import Button from '../Button/Button';
import React from 'react';
import { Link } from 'react-router-dom';
import InstrumentsCatalogue from '../InstrumentsCatalogue/InstrumentsCatalogue';
import { UserContext } from '../../context/context';
import { useContext } from 'react';
import { ThemeContext } from '../../context/context';
import cx from 'classnames';
import { strings } from '../../strings';

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
              {user === 'admin' && (
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
