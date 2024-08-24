import InstrumentsList from '../../components/InstrumentsList/InstrumentsList';
import styles from './Favorites.module.css';
import { Link } from 'react-router-dom';
import useDeleteItem from '../../hooks/useDeleteItem';
import { getFavorites } from '../../api/api';
import { useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../../helpers/supabaseClient';
import cx from 'classnames';
import { Button, Loader } from '../../components';

import { ThemeContext, UserContext } from '../../context';
import { USER_MESSAGES } from '../../strings';

const Favorites = () => {
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
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

  const handleDeleteSuccess = useCallback((deletedId) => {
    setReload((prev) => !prev);
  }, []);

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      {!user && (
        <div className={styles.container}>
          {USER_MESSAGES.NOT_AUTH}
          <Link to="/auth">
            <Button>{USER_MESSAGES.SIGN_IN}</Button>
          </Link>
        </div>
      )}
      {user && (
        <div className={styles.container}>
          <h2>{USER_MESSAGES.FAVS}</h2>
          {loading && <Loader />}
          <InstrumentsList
            data={data}
            deleteItem={deleteItem}
            statusDelete={statusDelete}
            errorDelete={errorDelete}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      )}
    </section>
  );
};

export default Favorites;
