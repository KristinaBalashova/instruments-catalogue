import { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { supabase } from '../../helpers/supabaseClient';
import useDeleteItem from '../../hooks/useDeleteItem';
import { getFavorites } from '../../api/api';

import { ThemeContext, UserContext } from '../../context';
import { USER_MESSAGES, THEME_DARK } from '../../strings';

import { Loader, StatusInfo } from '../../components';
import InstrumentsList from '../../components/InstrumentsList/InstrumentsList';

import styles from './Favorites.module.css';

const Favorites = () => {
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      try {
        const { favorites, favError } = await getFavorites(user?.id);

        if (favError) {
          setError(favError);
          setLoading(false);
          return;
        }

        const itemIds = favorites.map((fav) => fav.item_id);

        if (itemIds.length > 0) {
          const { data: items, error: itemsError } = await supabase
            .from('instruments_collection')
            .select('id, name, image')
            .in('id', itemIds);

          if (itemsError) {
            console.error(itemsError);
          } else {
            setData(items);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, reload]);

  const handleDeleteSuccess = useCallback(() => {
    setReload((prev) => !prev);
  }, []);

  return (
    <section className={cx(styles.root, theme === THEME_DARK && styles.darkTheme)}>
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
    </section>
  );
};

export default Favorites;
