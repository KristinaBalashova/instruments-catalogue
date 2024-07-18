import styles from './MainPage.module.css';
import Button from '../Button/Button';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstrumentsCatalogue from '../InstrumentsCatalogue/InstrumentsCatalogue';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const MainPage = () => {
  return (
    <>
      <Header />
      <section className={styles.root}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <h1 className={styles.headline}>Welcome to In-lib: Your Music Instruments Catalogue</h1>
            <p className={styles.description}>
              Discover a vast collection of musical instruments from around the world. Sign in or
              create an account to explore, manage, and enjoy our extensive library of instruments.{' '}
            </p>
            <div className={styles.auth}>
              <Link to="/authentification">
                <Button children="Sign in" />
              </Link>
            </div>
          </div>
          <div className={styles.galaxy}></div>
        </div>
      </section>
      <InstrumentsCatalogue />
      <Footer />
    </>
  );
};

export default MainPage;
