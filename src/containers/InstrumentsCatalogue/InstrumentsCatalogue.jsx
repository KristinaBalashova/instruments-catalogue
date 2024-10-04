import { useEffect, useState, useContext, useCallback } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { IoFilterOutline } from 'react-icons/io5';
import { THEME_DARK } from '../../strings';
import { supabase } from '../../helpers/supabaseClient';
import { ThemeContext } from '../../context';
import { setQuery } from '../../helpers/changeQuery';
import { getFiltersFromSearchParams } from '../../helpers/getFiltersFromSearchParams';
import useDeleteItem from '../../hooks/useDeleteItem';

import {
  FiltersPanel,
  PaginationButtons,
  SearchBar,
  Loader,
  InstrumentsList,
  StatusInfo,
} from '../../components';

import styles from './InstrumentsCatalogue.module.css';
import { USER_MESSAGES } from '../../strings';

const InstrumentsCatalogue = () => {
  const [searchParams] = useSearchParams();
  const { theme } = useContext(ThemeContext);
  const { deleteItem, errorDelete } = useDeleteItem();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [dataFilters, setDataFilters] = useState({});
  const [filtersToggle, setfiltersToggle] = useState(false);
  const [reload, setReload] = useState(false);

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

  const itemsPerPage = 9;
  const listOfFilters = ['brand', 'type', 'country'];

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('instruments_collection').select('*');

      if (error) {
        console.log(error);
      } else {
        const uniqueFilters = listOfFilters.reduce((acc, filter) => {
          acc[filter] = [...new Set(data.map((item) => item[filter]))];
          return acc;
        }, {});
        setDataFilters(uniqueFilters);
      }
      setLoading(false);
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    setQuery('page', 1, location, navigate);
  }, [brand, type, country, order, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

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
        console.log(error);
      } else {
        setData(data);
        setTotalItems(count);
      }

      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchQuery, brand, type, country, order, reload]);

  const handleDeleteSuccess = useCallback(() => {
    setReload((prev) => !prev);
  }, []);

  return (
    <section className={cx(styles.root, theme === THEME_DARK && styles.darkTheme)}>
      <div className={styles.container}>
        <div className={styles.nav}>
          <div className={styles.filters} onClick={() => setfiltersToggle(!filtersToggle)}>
            <button className={styles.filtersButton} aria-label="filters">
              <IoFilterOutline />
            </button>
            <span className={styles.filtersText}>Filters</span>
          </div>
          <SearchBar disabled={loading} />
        </div>
        <div className={cx(styles.filtersPanel, { [styles.visible]: filtersToggle })}>
          {filtersToggle && (
            <FiltersPanel data={{ ...dataFilters, order: ['new-first', 'old-first'] }} />
          )}
        </div>
        <div className={styles.cardsContainer}>
          {loading && <Loader />}
          {!loading && totalItems === 0 && <StatusInfo>{USER_MESSAGES.NOTHING_FOUND}</StatusInfo>}
          <InstrumentsList
            data={data}
            deleteItem={deleteItem}
            errorDelete={errorDelete}
            onDeleteSuccess={handleDeleteSuccess}
          />
          <PaginationButtons
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            isVisible={totalItems > itemsPerPage}
          />
        </div>
      </div>
    </section>
  );
};

export default InstrumentsCatalogue;
