import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import HeartSymbol from '../HeartSymbol/HeartSymbol';
import styles from './InstrumentCard.module.css';
import { UserContext } from '../../context/context';
import EditorButtons from '../EditorButtons/EditorButtons';
const InstrumentCard = ({ instrumentData }) => {
  const { id, name, picture_url } = instrumentData;
  const { user } = useContext(UserContext);

  return (
    <>
      <div key={id} className={styles.cardContainer}>
        <Link to="/instrument-page" state={{ instrumentData }} className={styles.link}>
          <img src={picture_url} alt={name} className={styles.img} />
        </Link>
        <div className={styles.content}>
          <Link to="/instrument-page" state={{ instrumentData }} className={styles.link}>
            <h3 className={styles.title}>{name}</h3>
          </Link>
          <div className={styles.buttons}>
            {user === 'admin' && <EditorButtons />}
            <div className={styles.fav}>
              <HeartSymbol />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstrumentCard;
