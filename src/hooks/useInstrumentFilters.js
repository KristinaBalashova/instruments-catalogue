import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { getFiltersFromSearchParams } from '../helpers/getFiltersFromSearchParams';
import { setQuery } from '../helpers/changeQuery';
import { useEffect } from 'react';

function useInstrumentFilters() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const filters = getFiltersFromSearchParams(searchParams);
  const searchQuery = searchParams.get('search') || '*';
  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1;

  useEffect(() => {
    setQuery('page', 1, location, navigate);
  }, [filters.brand, filters.type, filters.country, filters.order, searchQuery]);

  return {
    filters,
    searchQuery,
    currentPage,
  };
}

export default useInstrumentFilters;