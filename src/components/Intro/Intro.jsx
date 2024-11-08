import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { USER_MESSAGES, ROLE_ADMIN } from '../../strings';
import { UserContext } from '../../context';
import { Button } from '..';

import styles from './Intro.module.css';

const Intro = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>{USER_MESSAGES.TITLE}</h1>
      <p className={styles.description}>{USER_MESSAGES.DESCRIPTION}</p>
      <div className={styles.auth}>
        {user?.role === ROLE_ADMIN && (
          <Link to="/instrument-creator">
            <Button>{USER_MESSAGES.ADD_INSTRUMENT}</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Intro;
