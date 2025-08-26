import { memo } from 'react';
import styles from './InstrumentInfo.module.css';
import { FavoriteButton } from '../ui';
import useSetFavorite from '../../hooks/useSetFavorite';

const InstrumentInfo = ({ data }) => {
  if (!data) return null;
  const { id } = data;
  const { isFavorite, loading, handleSetFavorite } = useSetFavorite(id);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>{data.name}</h2>
        <div
          onClick={!loading ? handleSetFavorite : undefined}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <FavoriteButton filled={isFavorite} />
        </div>
      </div>

      <div className={styles.container}>
        {['brand', 'description', 'country', 'materials', 'type', 'date'].map((item) => (
          <p key={item} className={styles.item}>
            <span className={styles.name}>{item.charAt(0).toUpperCase() + item.slice(1)}:</span>
            {data[item]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default memo(InstrumentInfo);
