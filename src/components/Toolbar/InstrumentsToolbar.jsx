import { FiltersPanel, SearchBar } from './components';
import styles from './InstrumentsToolbar.module.css';
import FilterIcon from './components/FilterIcon/FilterIcon';
import cx from 'classnames';

const InstrumentsToolbar = ({
  orderRules,
  loadingData,
  filtersToggle,
  onToggleFilters,
  dataFilters,
  query,
}) => {

  const hasActiveFilters = query.some((item) => item !== '*');

  return (
    <>
      <div className={styles.container}>
        
        <SearchBar disabled={loadingData} />
        <div className={styles.filters} onClick={onToggleFilters}>
            <FilterIcon filtersToggle={filtersToggle} hasActiveFilters={hasActiveFilters} />
          <span className={styles.filtersText}>Filters</span>
        </div>
      </div>
      <div className={cx(styles.filtersPanel, { [styles.visible]: filtersToggle })}>
        {filtersToggle && <FiltersPanel data={{ ...dataFilters, order: orderRules }} />}
      </div>
    </>
  );
};

export default InstrumentsToolbar;
