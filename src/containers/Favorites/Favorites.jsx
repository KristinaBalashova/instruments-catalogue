import { useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';

import useFavorites from '../../hooks/useFavorites';
import useDeleteItem from '../../hooks/useDeleteItem';
import { UserContext } from '../../context';
import { USER_MESSAGES } from '../../strings';

import { Loader, StatusInfo, SectionLayout } from '../../components';
import InstrumentsList from '../../components/InstrumentsList/InstrumentsList';

import styles from './Favorites.module.css';

const Favorites = () => {
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();
  const { user } = useContext(UserContext);
  const { data, loading, error, reload } = useFavorites();

  const handleDeleteSuccess = useCallback(() => {
    reload();
  }, [reload]);

  return (
    <SectionLayout>
      {!user && (
        <div className={styles.container}>
          {USER_MESSAGES.NOT_AUTH}
          <Link to="/auth">{USER_MESSAGES.SIGN_IN}</Link>
        </div>
      )}
      {user && (
        <div className={styles.container}>
          {loading && <Loader />}
          {!loading && data.length === 0 && (
            <StatusInfo>
              {USER_MESSAGES.NO_FAVS}
              <Link to="/">{USER_MESSAGES.RETURN}</Link>
            </StatusInfo>
          )}
          {!loading && data.length > 0 && (
            <InstrumentsList
              data={data}
              deleteItem={deleteItem}
              statusDelete={statusDelete}
              errorDelete={errorDelete}
              onDeleteSuccess={handleDeleteSuccess}
              onFavDelete={handleDeleteSuccess}
              className={styles.instrumentsList}
            />
          )}
        </div>
      )}
    </SectionLayout>
  );
};

export default Favorites;
