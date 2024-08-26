import React from 'react';
import { InstrumentCard } from '../../containers';
import styles from './InstrumentsList.module.css';
import cx from 'classnames';

const InstrumentsList = ({ data, deleteItem, errorDelete, onDeleteSuccess, className }) => {
  return (
    <div className={cx(styles.cards, className)}>
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
