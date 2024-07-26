import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './InstrumentCard.module.css';
import { UserContext } from '../../context/context';
import EditorButtons from '../EditorButtons/EditorButtons';

const InstrumentCard = ({ instrumentData }) => {
  const { id, name, image } = instrumentData;
  const { user } = useContext(UserContext);

  return (
    <>
      <div key={id} className={styles.cardContainer}>
        <Link to={`/instrument-page/${id}`} state={{ instrumentData }} className={styles.link}>
          <img src={image} alt={name} className={styles.img} />
        </Link>
        <div className={styles.content}>
          <Link to={`/instrument-page/${id}`} state={{ instrumentData }} className={styles.link}>
            <h3 className={styles.title}>{name}</h3>
          </Link>
          <div className={styles.buttons}>
            {user === 'admin' && <EditorButtons id={id} />}
            {/*
              <div className={styles.fav}>
              <img src="/heart.svg" className={styles.heart} alt="favorite-heart" />
            </div>
              */}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstrumentCard;
