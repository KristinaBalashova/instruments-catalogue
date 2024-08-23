import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../../helpers/supabaseClient';
import { UserContext } from '../../context/context';

import { EditorButtons } from '../../components';

import styles from './InstrumentCard.module.css';

const InstrumentCard = ({ instrumentData, onDelete, errorDelete }) => {
  const { id, name, image } = instrumentData;
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user) return;

      setLoading(true);
      console.log(user?.id);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('item_id')
          .eq('user_id', user?.id);

        if (error) throw error;

        const favoriteCardIds = data.map((item) => item.item_id);
        setIsFavorite(favoriteCardIds.includes(id));
      } catch (error) {
        console.error('Error fetching favorite status:', error);
      }
      setLoading(false);
    };

    fetchFavoriteStatus();
  }, [user, id]);

  const handleClick = async () => {
    if (!user) {
      alert('You must be logged in to add favorites');
      return;
    }

    const favItem = {
      item_id: id,
      user_id: user?.id,
    };

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ item_id: id, user_id: user?.id });

        if (error) throw error;
      } else {
        const { error } = await supabase.from('favorites').insert(favItem);

        if (error) throw error;
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
