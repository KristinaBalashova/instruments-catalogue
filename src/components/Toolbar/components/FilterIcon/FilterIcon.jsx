import { IoFilterCircle, IoFilterCircleOutline } from 'react-icons/io5';
import classNames from 'classnames';
import styles from './FilterIcon.module.css';

const FilterIcon = ({ hasActiveFilters }) => {
  const IconComponent = hasActiveFilters ? IoFilterCircle : IoFilterCircleOutline;

  return <IconComponent className={classNames(styles.filtersIcon, styles.transitionIcon)} />;
};

export default FilterIcon;
