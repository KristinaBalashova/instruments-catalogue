import { useEffect, useState, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../helpers/supabaseClient';
import { ThemeContext } from '../../context';
import { setQuery } from '../../helpers/changeQuery';
import { getFiltersFromSearchParams } from '../../helpers/getFiltersFromSearchParams';
import useDeleteItem from '../../hooks/useDeleteItem';
import { useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames';

import {
  FiltersPanel,
  PaginationButtons,
  SearchBar,
  Loader,
  InstrumentsList,
  Modal,
  Button,
  StatusInfo,
} from '../../components';

import styles from './InstrumentsCatalogue.module.css';

const InstrumentsCatalogue = () => {
  const [searchParams] = useSearchParams();
  const { theme } = useContext(ThemeContext);
  const { deleteItem, errorDelete } = useDeleteItem();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [dataFilters, setDataFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const filtersObject = getFiltersFromSearchParams(searchParams);
  const { brand = '*', type = '*', country = '*', order = 'new-first' } = filtersObject;

  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1;
  const searchQuery = searchParams.get('search') || '*';

  const itemsPerPage = 6;
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
  }, [currentPage, searchQuery, brand, type, country, order]);

  const handleDeleteSuccess = useCallback((deletedId) => {
    setData((prevData) => prevData.filter((item) => item.id !== deletedId));
    setTotalItems((prevTotal) => prevTotal - 1);
  }, []);

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <div className={styles.search}>
          <SearchBar disabled={loading} />
          <FiltersPanel data={{ order: ['new-first', 'old-first'] }} clearButton={false} />
        </div>
        <div className={styles.dataContainer}>
          <div className={styles.filtersMobile}>
            <Button secondary onClick={() => setIsModalOpen(true)}>
              Filters
            </Button>
            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appElement={document.getElementById('root') || undefined}
              >
                <FiltersPanel data={dataFilters} />
              </Modal>
            )}
          </div>
          <div className={styles.filtersDesktop}>
            <FiltersPanel data={dataFilters} />
          </div>

          {loading && <Loader />}
          {!loading && totalItems === 0 && <StatusInfo>{'nothing found'}</StatusInfo>}
          <div className={styles.cardsContainer}>
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
      </div>
    </section>
  );
};

export default InstrumentsCatalogue;
