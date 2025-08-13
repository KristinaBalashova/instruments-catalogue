import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../helpers/supabaseClient';

function useInstrumentsData({ filters, searchQuery, currentPage, itemsPerPage }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let query = supabase
        .from('instruments_collection')
        .select('name, image, id, timestamp', { count: 'exact' });

      if (filters.brand !== '*') query = query.ilike('brand', filters.brand);
      if (filters.type !== '*') query = query.ilike('type', filters.type);
      if (filters.country !== '*') query = query.ilike('country', filters.country);

      if (filters.order === 'new-first') {
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
      setLoading(false);
    }

    fetchData();
  }, [filters, searchQuery, currentPage, itemsPerPage, reload]);

  const reloadData = useCallback(() => setReload((prev) => !prev), []);

  return { data, totalItems, loading, reloadData };
}

export default useInstrumentsData;