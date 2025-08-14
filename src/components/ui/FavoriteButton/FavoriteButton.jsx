import { FaStar } from 'react-icons/fa';

import styles from './FavoriteButton.module.css';

const FavoriteButton = ({ filled }) => {

  return (
    <FaStar
      className={filled ? styles.filled : styles.unfilled}
      
    />
  );
};

export default FavoriteButton;
