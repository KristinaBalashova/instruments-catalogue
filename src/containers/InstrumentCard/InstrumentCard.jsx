import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

import { USER_MESSAGES } from '../../strings';
import { getFavorites, deleteFavItem, insertFavItem } from '../../api/api';
import { UserContext } from '../../context';

import { EditorButtons } from '../../components';

import styles from './InstrumentCard.module.css';

const InstrumentCard = ({ instrumentData, onDelete, errorDelete }) => {
  const { id, name, image } = instrumentData;
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user) return;

      const { favorites, favError } = await getFavorites(user?.id);

      if (error) throw error;

      const favoriteCardIds = favorites.map((item) => item.item_id);

      setIsFavorite(favoriteCardIds.includes(id));

      if (favError) {
        console.error(favError);
      }
    };

    fetchFavoriteStatus();
  }, [user, id]);

  const handleClick = async () => {
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
    <div key={id} className={styles.container}>
      <Link to={`/instrument-page/${id}`} state={{ instrumentData }} className={styles.link}>
        <img src={image} alt={name} className={styles.img} />
      </Link>
      <div className={styles.content}>
        <Link to={`/instrument-page/${id}`} state={{ instrumentData }} className={styles.link}>
          <h3 className={styles.title}>{name}</h3>
        </Link>
        <div className={styles.buttons}>
          {user?.role === 'admin' && (
            <EditorButtons id={id} onDelete={onDelete} errorDelete={errorDelete} />
          )}
          <FaStar className={isFavorite ? styles.filled : styles.unfilled} onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default InstrumentCard;
