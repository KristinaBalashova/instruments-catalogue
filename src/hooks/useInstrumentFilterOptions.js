import { useEffect, useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

function useInstrumentFilterOptions() {
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const listOfFilters = ['brand', 'type', 'country'];

  useEffect(() => {
    async function fetchFilters() {
      setLoading(true);
      const { data, error } = await supabase.from('instruments_collection').select('*');
      if (!error) {
        const uniqueFilters = listOfFilters.reduce((acc, filter) => {
          acc[filter] = [...new Set(data.map((item) => item[filter]))];
          return acc;
        }, {});
        setFilters(uniqueFilters);
      }
      setLoading(false);
    }
    fetchFilters();
  }, []);

  return { filters, loading };
}

export default useInstrumentFilterOptions;