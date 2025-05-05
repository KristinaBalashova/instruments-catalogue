import { useState, useEffect } from 'react';
import { supabase } from '../helpers/supabaseClient';
import { getFiltersFromSearchParams } from '../helpers/getFiltersFromSearchParams';
import { setQuery } from '../helpers/changeQuery';
import { useLocation, useNavigate } from 'react-router-dom';

const useFetchFilteredData = (searchParams, itemsPerPage) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [error, setError] = useState(null);
  //const [reload, setReload] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    brand = '*',
    type = '*',
    country = '*',
    order = 'new-first',
  } = getFiltersFromSearchParams(searchParams);

  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1;
  const searchQuery = searchParams.get('search') || '*';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorFetch(null);

      let query = supabase
        .from('instruments_collection')
        .select('name, image, id, timestamp', { count: 'exact' });

      if (brand !== '*') query = query.ilike('brand', brand);
      if (type !== '*') query = query.ilike('type', type);
      if (country !== '*') query = query.ilike('country', country);

      if (order === 'new-first') {
        query = query.order('timestamp', { ascending: false });
      } else if (order === 'old-first') {
        query = query.order('timestamp', { ascending: true });
      }

      const { data, error, count } = await query
        .ilike('name', `%${searchQuery}%`)
        .range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

      if (error) {
        setError(error);
        console.log(error);
      } else {
        setData(data);
        setItemsCount(count);
      }

      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchQuery, brand, type, country, order, reload]);

  useEffect(() => {
    setQuery('page', 1, location, navigate);
  }, [brand, type, country, order, searchQuery, location, navigate]);

  //const triggerReload = () => setReload((prev) => !prev);

  return {
    data,
    loading,
    error,
    itemsCount,
  };
};

export default useFetchFilteredData;
