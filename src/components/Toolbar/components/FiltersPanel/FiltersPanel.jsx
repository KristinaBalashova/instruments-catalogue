import { USER_MESSAGES } from '../../../../strings';
import { Button } from '../../..';
import styles from './FiltersPanel.module.css';
import { setQuery, deleteQuery } from '../../../../helpers/changeQuery';
import { useLocation, useNavigate } from 'react-router-dom';

const FiltersPanel = ({ data, clearButton = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (value === '*') {
      deleteQuery(name, location, navigate);
    } else {
      setQuery(name, value, location, navigate);
    }
  };

  const handleFilterClear = () => {
    const searchParams = new URLSearchParams(location.search);
    Object.keys(data).forEach((filter) => {
      searchParams.delete(filter);
    });
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  return (
    <div className={styles.container}>
      {Object.keys(data).map((filter) => (
        <form key={filter} className={styles.form}>
          <label className={styles.label}>{filter}</label>
          <select
            id={filter}
            name={filter}
            onChange={handleFilterChange}
            className={styles.select}
            value={new URLSearchParams(location.search).get(filter) || '*'}
          >
            <option value={'*'}>{USER_MESSAGES.ALL}</option>
            {data[filter] &&
              data[filter].map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </select>
        </form>
      ))}
      {clearButton && (
        <Button secondary onClick={handleFilterClear} className={styles.button}>
          {USER_MESSAGES.CLEAR_FILTERS}
        </Button>
      )}
    </div>
  );
};

export default FiltersPanel;
