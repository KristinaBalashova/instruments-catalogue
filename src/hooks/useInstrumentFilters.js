import { useState, useEffect } from 'react';
import { supabase } from '../helpers/supabaseClient';

export function useInstrumentsFilters(listOfFilters) {
  const [dataFilters, setDataFilters] = useState({});
  const [loadingFilters, setLoadingFilters] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingFilters(true);
      const { data, error } = await supabase.from('instruments_collection').select('*');

      if (!error) {
        const uniqueFilters = listOfFilters.reduce((acc, filter) => {
          acc[filter] = [...new Set(data.map((item) => item[filter]))];
          return acc;
        }, {});
        setDataFilters(uniqueFilters);
      }
      setLoadingFilters(false);
    };

    fetchAllData();
  }, [listOfFilters]);

  return { dataFilters, loadingFilters };
}