import React from 'react';
import { FaStar } from 'react-icons/fa';
import useSetFavorite from '../../hooks/useSetFavorite';
import styles from './FavoriteButton.module.css';

const FavoriteButton = ({ id }) => {
  const { isFavorite, loading, error, handleSetFavorite } = useSetFavorite(id);

  if (error) {
    alert(error.message);
  }

  return (
    <FaStar
      className={isFavorite ? styles.filled : styles.unfilled}
      onClick={handleSetFavorite}
      disabled={loading}
    />
  );
};

export default FavoriteButton;
