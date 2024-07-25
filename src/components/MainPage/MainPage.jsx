import styles from './MainPage.module.css';
import Button from '../Button/Button';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstrumentsCatalogue from '../InstrumentsCatalogue/InstrumentsCatalogue';
import { UserContext } from '../../context/context';
import { useContext } from 'react';

const MainPage = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <section className={styles.root}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <h1 className={styles.headline}>Welcome to In-lib: Your Music Instruments Catalogue</h1>
            <p className={styles.description}>
              Discover a vast collection of musical instruments from around the world. Sign in or
              create an account to explore, manage, and enjoy our extensive library of instruments.{' '}
            </p>
            <div className={styles.auth}>
              {user === 'admin' && (
                <Link to="/instrument-creator">
                  <Button>Add new instrument</Button>
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
