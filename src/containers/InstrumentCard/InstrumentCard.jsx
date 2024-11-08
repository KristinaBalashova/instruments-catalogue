import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import cx from 'classnames';

import { THEME_DARK, ROLE_ADMIN } from '../../strings';
import { UserContext, ThemeContext } from '../../context';
import { EditorButtons } from '../../components';

import useSetFavorite from '../../hooks/useSetFavorite';
import styles from './InstrumentCard.module.css';

const InstrumentCard = ({ instrumentData, onDelete, errorDelete, onFavDelete }) => {
  const { id, name, image } = instrumentData;
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const { isFavorite, loading, error, handleSetFavorite } = useSetFavorite(id);

  if (error) {
    alert(error.message);
  }

  return (
    <div
      key={id}
      className={cx(styles.root, styles.link, theme === THEME_DARK && styles.darkTheme)}
    >
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
            <FaStar
              className={isFavorite ? styles.filled : styles.unfilled}
              onClick={handleSetFavorite}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCard;
