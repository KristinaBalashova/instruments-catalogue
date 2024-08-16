import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useFetchItem = (id) => {
  const [fetchedItem, setFetchedItem] = useState(null);
  const [errorFetch, setErrorFetch] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setStatusFetch(false);
      const { data, error } = await supabase
        .from('instruments_collection')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setErrorFetch('Error fetching instrument data.');
      } else {
        setFetchedItem(data);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  return {
    fetchedItem,
    errorFetch,
  };
};

export default useFetchItem;
