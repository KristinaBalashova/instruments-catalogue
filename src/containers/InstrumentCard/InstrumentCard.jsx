import { useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { ROLE_ADMIN } from '../../strings';
import { UserContext } from '../../context';
import { EditorButtons } from '../../components';
import { FavoriteButton } from '../../components/ui';
import styles from './InstrumentCard.module.css';
import useSetFavorite from '../../hooks/useSetFavorite';

const InstrumentCard = ({ instrumentData, onDelete, errorDelete, onFavDelete }) => {
  const { id, name, image } = instrumentData;
  const { isFavorite, loading, handleSetFavorite } = useSetFavorite(id);
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
            <div
              onClick={!loading ? handleSetFavorite : undefined}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <FavoriteButton filled={isFavorite} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCard;
