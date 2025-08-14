import { useEffect, useState} from 'react';
import { supabase } from '../helpers/supabaseClient';

function useInstrumentsData({ brand, type, country, order, searchQuery, currentPage, itemsPerPage, reload }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingData (true);
      let query = supabase
        .from('instruments_collection')
        .select('name, image, id, timestamp', { count: 'exact' });

      if (brand !== '*') query = query.ilike('brand', brand);
      if (type !== '*') query = query.ilike('type', type);
      if (country !== '*') query = query.ilike('country', country);

      if (order === 'new-first') {
        query = query.order('timestamp', { ascending: false });
      } else {
        query = query.order('timestamp', { ascending: true });
      }

      const { data, error, count } = await query
        .ilike('name', `%${searchQuery}%`)
        .range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

      if (!error) {
        setData(data);
        setTotalItems(count);
      }
      setLoadingData(false);
    }

    fetchData();
  }, [brand, type, country, order, searchQuery, currentPage, itemsPerPage, reload]);

  return { data, totalItems, loadingData};
}

export default useInstrumentsData;