import React from 'react';
import cx from 'classnames';
import styles from './PaginationButtons.module.css';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

const PaginationButtons = ({
  currentPage,
  totalItems,
  itemsPerPage,
  setCurrentPage,
  isVisible,
  updateQuery,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isBackDisabled = currentPage === 0;
  const isForwardDisabled = currentPage + 1 >= totalPages;

  const handleBackClick = () => {
    if (!isBackDisabled) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      updateQuery('page', newPage + 1);
    }
  };

  const handleForwardClick = () => {
    if (!isForwardDisabled) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      updateQuery('page', newPage + 1);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <span className={styles.pageCounter}>
        Page {currentPage + 1} of {totalPages}
      </span>

      <div className={styles.buttons}>
        <button
          className={cx(styles.button, styles.back, isBackDisabled && styles.disabled)}
          onClick={handleBackClick}
          disabled={isBackDisabled}
        >
          <IoIosArrowBack className={styles.arrow} />
        </button>
        <button
          className={cx(styles.button, styles.forward, isForwardDisabled && styles.disabled)}
          onClick={handleForwardClick}
          disabled={isForwardDisabled}
        >
          <IoIosArrowForward className={styles.arrow} />
        </button>
      </div>
    </div>
  );
};

export default PaginationButtons;
