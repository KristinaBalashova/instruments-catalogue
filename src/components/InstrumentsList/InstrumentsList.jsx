import React from 'react';
import InstrumentCard from '../../containers/InstrumentCard/InstrumentCard';
import styles from './InstrumentsList.module.css';

const InstrumentsList = ({ data, deleteItem, statusDelete, errorDelete, onDeleteSuccess }) => {
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
        />
      ))}
    </div>
  );
};

export default InstrumentsList;
