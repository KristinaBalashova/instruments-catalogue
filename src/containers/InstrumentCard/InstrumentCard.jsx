import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import cx from 'classnames';

import { USER_MESSAGES, THEME_DARK, ROLE_ADMIN } from '../../strings';
import { getFavorites, deleteFavItem, insertFavItem } from '../../api/api';
import { UserContext, ThemeContext } from '../../context';

import { EditorButtons } from '../../components';

import styles from './InstrumentCard.module.css';

const InstrumentCard = ({ instrumentData, onDelete, errorDelete, onFavDelete }) => {
  const { id, name, image } = instrumentData;
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user) return;

      const { favorites, favError } = await getFavorites(user?.id);

      const favoriteCardIds = favorites.map((item) => item.item_id);

      setIsFavorite(favoriteCardIds.includes(id));

      if (favError) {
        console.error(favError);
      }
    };

    fetchFavoriteStatus();
  }, [user, id]);

  const handleFavClick = async () => {
    if (!user) {
      alert(USER_MESSAGES.LOGIN_TO_ADD_FAVS);
      return;
    }

    const favItem = {
      item_id: id,
      user_id: user?.id,
    };

    try {
      if (isFavorite) {
        const { deleteError } = await deleteFavItem(id, user?.id);
        if (deleteError) throw deleteError;
        onFavDelete();
      } else {
        const { insertError } = await insertFavItem(favItem);
        if (insertError) throw insertError;
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      key={id}
      className={cx(styles.root, styles.link, theme === THEME_DARK && styles.darkTheme)}
    >
      <div className={styles.container}>
        <Link to={`/instrument-page/${id}`} className={styles.link}>
          <img src={image} alt={name} className={styles.img} />
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
              onClick={handleFavClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCard;
