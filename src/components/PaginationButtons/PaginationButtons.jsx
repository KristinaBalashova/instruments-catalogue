import React from 'react';
import cx from 'classnames';
import styles from './PaginationButtons.module.css';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';

const PaginationButtons = ({
  currentPage,
  totalItems,
  itemsPerPage,
  setCurrentPage,
  isVisible,
}) => {
  const handleBackClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleForwardClick = () => {
    if ((currentPage + 1) * itemsPerPage < totalItems) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.paginationButtons}>
      <button
        className={cx(styles.paginationButton, styles.back)}
        onClick={handleBackClick}
        disabled={currentPage === 0}
      >
        <IoIosArrowBack className={styles.arrow} />
      </button>
      <button
        className={cx(styles.paginationButton, styles.forward)}
        onClick={handleForwardClick}
        disabled={(currentPage + 1) * itemsPerPage >= totalItems}
      >
        <IoIosArrowForward className={styles.arrow} />
      </button>
    </div>
  );
};

export default PaginationButtons;
