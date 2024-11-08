import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { ROLE_ADMIN } from '../../strings';
import { UserContext, ThemeContext } from '../../context';
import { EditorButtons, FavoriteButton } from '../../components';
import styles from './InstrumentCard.module.css';

const InstrumentCard = ({ instrumentData, onDelete, errorDelete, onFavDelete }) => {
  const { id, name, image } = instrumentData;
  const { user } = useContext(UserContext);

  return (
    <div key={id} className={cx(styles.root, styles.link)}>
      <div className={styles.container}>
        <Link to={`/instrument-page/${id}`} className={styles.link}>
          <img src={image} alt={name} className={styles.img} loading="lazy" />
        </Link>
        <div className={styles.info}>
          <Link to={`/instrument-page/${id}`} className={styles.link}>
            <h3 className={styles.title}>{name}</h3>
          </Link>

          <div className={styles.cardManager}>
            {user?.role === ROLE_ADMIN && (
              <EditorButtons id={id} onDelete={onDelete} errorDelete={errorDelete} />
            )}
            <FavoriteButton id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCard;
