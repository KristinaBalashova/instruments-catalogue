import InstrumentsList from '../../components/InstrumentsList/InstrumentsList';
import styles from './Favorites.module.css';
import { Link } from 'react-router-dom';
import useDeleteItem from '../../hooks/useDeleteItem';
import { useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../../helpers/supabaseClient';

import { Button, Loader } from '../../components';

import { UserContext } from '../../context/context';
import { USER_MESSAGES } from '../../strings';

const Favorites = () => {
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      try {
        const { data: favorites, error: favError } = await supabase
          .from('favorites')
          .select('item_id')
          .eq('user_id', user?.id);

        if (favError) {
          console.log(favError);
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
        } else {
          setData([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleDeleteSuccess = useCallback((deletedId) => {
    setData((prevData) => prevData.filter((item) => item.id !== deletedId));
  }, []);

  return (
    <section className={styles.root}>
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
