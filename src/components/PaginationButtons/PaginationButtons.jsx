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
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleBackClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleForwardClick = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <span className={styles.pageCounter}>
        Page {currentPage + 1} from {totalPages}
      </span>

      <div className={styles.buttons}>
        <button
          className={cx(styles.button, styles.back, { [styles.disabled]: currentPage === 0 })}
          onClick={handleBackClick}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack className={styles.arrow} />
        </button>
        <button
          className={cx(styles.button, styles.forward, {
            [styles.disabled]: currentPage + 1 >= totalPages,
          })}
          onClick={handleForwardClick}
          disabled={currentPage + 1 >= totalPages}
        >
          <IoIosArrowForward className={styles.arrow} />
        </button>
      </div>
    </div>
  );
};

export default PaginationButtons;
