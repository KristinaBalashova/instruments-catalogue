import { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { THEME_DARK } from '../../strings';
import { ThemeContext } from '../../context';
import { setQuery } from '../../helpers/changeQuery';
import { getFiltersFromSearchParams } from '../../helpers/getFiltersFromSearchParams';
import useDeleteItem from '../../hooks/useDeleteItem';
import useInstrumentsData from '../../hooks/useInstrumentsData';
import { useInstrumentsFilters } from '../../hooks/useInstrumentFilters';

import {
  PaginationButtons,
  Loader,
  InstrumentsList,
  StatusInfo,
  InstrumentsToolbar,
} from '../../components';

import styles from './InstrumentsCatalogue.module.css';
import { USER_MESSAGES } from '../../strings';

const InstrumentsCatalogue = () => {
  const [searchParams] = useSearchParams();
  const { theme } = useContext(ThemeContext);
  const { deleteItem, errorDelete } = useDeleteItem();
  const [filtersToggle, setfiltersToggle] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const itemsPerPage = 9;
  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1;
  const searchQuery = searchParams.get('search') || '*';
  const listOfFilters = useMemo(() => ['brand', 'type', 'country'], []);
  const orderRules = useMemo(() => ['new-first', 'old-first'], []);

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
    reload,
  });

  const { dataFilters, loadingFilters } = useInstrumentsFilters(listOfFilters);

  useEffect(() => {
    
    setQuery('page', 1, location, navigate);
  }, [brand, type, country, order, searchQuery]);

  const handleDeleteSuccess = useCallback(() => {
    setReload((prev) => !prev);
  }, []);

  return (
    <section className={cx(styles.root, theme === THEME_DARK && styles.darkTheme)}>
      <div className={styles.container}>
        <InstrumentsToolbar
          orderRules={orderRules}
          filtersToggle={filtersToggle}
          onToggleFilters={() => setfiltersToggle((prev) => !prev)}
          loadingData={loadingFilters}
          dataFilters={dataFilters}
        />
        <div className={styles.cardsContainer}>
          {loadingData && <Loader />}
          {!loadingData && totalItems === 0 && (
            <StatusInfo>{USER_MESSAGES.NOTHING_FOUND}</StatusInfo>
          )}
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
