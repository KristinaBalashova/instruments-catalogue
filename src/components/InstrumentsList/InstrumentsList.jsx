import React from 'react';
import InstrumentCard from '../InstrumentCard/InstrumentCard';
import styles from './InstrumentsList.module.css';

const InstrumentsList = ({
  data,
  deleteItem,
  statusDelete,
  errorDelete,
  isAdmin,
  onDeleteSuccess,
}) => {
  return (
    <div className={styles.cards}>
      {data.map((item) => (
        <InstrumentCard
          key={item.id}
          instrumentData={item}
          onDelete={() =>
            deleteItem('instruments_collection', item.id, () => onDeleteSuccess(item.id))
          }
          statusDelete={statusDelete}
          errorDelete={errorDelete}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default InstrumentsList;
