import InstrumentsList from '../InstrumentsList/InstrumentsList';
import styles from './Favorites.module.css';
import useDeleteItem from '../../hooks/useDeleteItem';
import { useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../../supabaseClient';
import Loader from '../Loader/Loader';
import { UserContext } from '../../context/context';
import { strings } from '../../strings';

const Favorites = () => {
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      try {
        const { data: favorites, error: favError } = await supabase
          .from('favorites')
          .select('item_id')
          .eq('user_id', user?.id);

        if (favError) {
          console.error(strings.errors.fethingData, favError);
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
            console.error(strings.errors.fethingData, itemsError);
          } else {
            setData(items);
          }
        } else {
          setData([]);
        }
      } catch (error) {
        console.error(strings.errors.fethingData, error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleDeleteSuccess = useCallback((deletedId) => {
    setData((prevData) => prevData.filter((item) => item.id !== deletedId));
    setTotalItems((prevTotal) => prevTotal - 1);
  }, []);

  return (
    <section className={styles.root}>
      <h2>Your favorite instruments are here!</h2>
      {loading && <Loader />}
      <InstrumentsList
        data={data}
        deleteItem={deleteItem}
        statusDelete={statusDelete}
        errorDelete={errorDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </section>
  );
};

export default Favorites;
