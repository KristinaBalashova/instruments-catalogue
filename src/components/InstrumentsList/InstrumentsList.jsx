import React from 'react';
import { InstrumentCard } from '../../containers';
import styles from './InstrumentsList.module.css';

const InstrumentsList = ({ data, deleteItem, errorDelete, onDeleteSuccess }) => {
  return (
    <div className={styles.cards}>
      {data.map((item) => (
        <InstrumentCard
          key={item.id}
          instrumentData={item}
          onDelete={() => deleteItem(item.id, () => onDeleteSuccess(item.id))}
          onFavDelete={onDeleteSuccess}
          errorDelete={errorDelete}
        />
      ))}
    </div>
  );
};

export default InstrumentsList;
