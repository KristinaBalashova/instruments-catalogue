import { FiltersPanel, SearchBar } from './components';
import styles from './InstrumentsToolbar.module.css';
import { IoFilterOutline } from 'react-icons/io5';
import cx from 'classnames';

const InstrumentsToolbar = ({ orderRules, loadingData, filtersToggle, onToggleFilters, dataFilters }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.filters} onClick={onToggleFilters}>
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
          <FiltersPanel data={{ ...dataFilters, order: orderRules }} />
        )}
      </div>
    </>
  );
};

export default InstrumentsToolbar;
