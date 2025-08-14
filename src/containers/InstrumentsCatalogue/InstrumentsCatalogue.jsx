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
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/loadingSlice';
import useInstrumentsData from '../../hooks/useInstrumentsData';

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
  const [dataFilters, setDataFilters] = useState({});
  const [filtersToggle, setfiltersToggle] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const itemsPerPage = 9;
  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1;
  const searchQuery = searchParams.get('search') || '*';
  
  const {
    brand = '*',
    type = '*',
    country = '*',
    order = 'new-first',
  } = getFiltersFromSearchParams(searchParams);

  const { loadingData, data, totalItems } = useInstrumentsData({
    brand,
    type,
    country,
    order,
    searchQuery,
    currentPage,
    itemsPerPage,
    reload
  });

  const listOfFilters = ['brand', 'type', 'country'];

  useEffect(() => {
    const fetchAllData = async () => {
      dispatch(setLoading(true));  
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
      dispatch(setLoading(false));
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    setQuery('page', 1, location, navigate);
  }, [brand, type, country, order, searchQuery]);

  const handleDeleteSuccess = useCallback(() => {
    setReload((prev) => !prev);
  }, []);

  return (
    <section className={cx(styles.root, theme === THEME_DARK && styles.darkTheme)}>
      <div className={styles.container}>
        <div className={styles.nav}>
          <div className={styles.filters} onClick={() => setfiltersToggle(!filtersToggle)}>
            <IoFilterOutline
              className={cx(styles.filtersIcon, filtersToggle && styles.active)}
              aria-label="filters"
            />
            <span className={styles.filtersText}>Filters</span>
          </div>
          <SearchBar disabled={loadingData} />
        </div>
        <div className={cx(styles.filtersPanel, { [styles.visible]: filtersToggle })}>
          {filtersToggle && (
            <FiltersPanel data={{ ...dataFilters, order: ['new-first', 'old-first'] }} />
          )}
        </div>
        <div className={styles.cardsContainer}>
          {loadingData && <Loader />}
          {!loadingData && totalItems === 0 && <StatusInfo>{USER_MESSAGES.NOTHING_FOUND}</StatusInfo>}
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
