import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import cx from 'classnames';

import { USER_MESSAGES } from '../../strings';
import { getFavorites, deleteFavItem, insertFavItem } from '../../api/api';
import { UserContext, ThemeContext } from '../../context';

import { EditorButtons } from '../../components';

import styles from './InstrumentCard.module.css';

const InstrumentCard = ({ instrumentData, onDelete, errorDelete, onFavDelete }) => {
  const { id, name, image } = instrumentData;
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

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

  const handleFavClick = async (event) => {
    //event.preventDefault(); // Prevent default action
    //event.stopPropagation(); // Stop event propagation

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

  const handleDeleteClick = (event) => {
    event.preventDefault(); // Prevent default action
    event.stopPropagation(); // Stop event propagation
  };

  const handleCardClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/instrument-page/${id}`, { state: { instrumentData } });
  };

  return (
    <div key={id} className={cx(styles.root, styles.link, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <img src={image} alt={name} className={styles.img} />
        <div className={styles.info}>
          <h3 className={styles.title}>{name}</h3>
          <div className={styles.cardManager}>
            {user?.role === 'admin' && (
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
