import React from 'react';
import { Link } from 'react-router-dom';
import HeartSymbol from '../HeartSymbol/HeartSymbol';
import styles from './InstrumentCard.module.css';
import { useContext } from 'react';
import { UserContext } from '../../context/context';

const InstrumentCard = ({ instrumentData }) => {
  const { id, name, picture_url } = instrumentData;
  const { user } = useContext(UserContext);

  console.log(user);
  return (
    <div key={id} className={styles.cardContainer}>
      <Link to="/instrument-page" state={{ instrumentData }} className={styles.link}>
        <img src={picture_url} alt={name} className={styles.img} />
      </Link>
      <div className={styles.content}>
        <Link to="/instrument-page" state={{ instrumentData }} className={styles.link}>
          <h3 className={styles.title}>{name}</h3>
        </Link>
        <div className={styles.buttons}>
          {user === 'editor' && (
            <div className={styles.editorButtons}>
              <Link to="/instrument-edit" className={styles.link}>
                <span className={styles.edit}>&#9998;</span>
              </Link>
              <Link to="/instrument-creator" className={styles.link}>
                <span className={styles.edit}>&#128465;</span>
              </Link>
            </div>
          )}
          <div className={styles.fav}>
            <HeartSymbol />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCard;
