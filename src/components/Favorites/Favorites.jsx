import InstrumentsList from '../InstrumentsList/InstrumentsList';
import styles from './Favorites.module.css';
import useDeleteItem from '../../hooks/useDeleteItem';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import Loader from '../Loader/Loader';

const Favorites = () => {
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('favorites').select('*');

      if (error) {
        console.error(strings.errors.fethingData, error);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    fetchAllData();
  }, []);

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
