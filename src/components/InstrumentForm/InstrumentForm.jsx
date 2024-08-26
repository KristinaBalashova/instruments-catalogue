import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input, Modal, StatusInfo } from '../';
import styles from './InstrumentForm.module.css';
import { USER_MESSAGES, STATUS_SUCCESS } from '../../strings';

const InstrumentForm = ({ data, onChange, onSubmit, isLoading, isSuccess, submitDisabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(isSuccess);

  useEffect(() => {
    setIsModalOpen(isSuccess);
  }, [isSuccess]);

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {Object.keys(data)
        .filter((item) => item !== 'timestamp' && item !== 'id' && item !== 'image')
        .map((item) => {
          const inputType = item === 'date' ? 'date' : 'text';

          return (
            <Input
              id={item}
              type={inputType}
              name={item}
              value={data[item]}
              onChange={onChange}
              required
              label={item.charAt(0).toUpperCase() + item.slice(1)}
              key={item}
            />
          );
        })}
      <Button type="submit" disabled={isLoading || submitDisabled}>
        {USER_MESSAGES.SAVE}
      </Button>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appElement={document.getElementById('root') || undefined}
        >
          <StatusInfo status={STATUS_SUCCESS}>{USER_MESSAGES.STATUS.SAVE_SUCCESS}</StatusInfo>
          <div className={styles.modalButtons}>
            <Button onClick={() => setIsModalOpen(false)}>{USER_MESSAGES.STAY}</Button>
            <Link to="/">
              <Button secondary>{USER_MESSAGES.RETURN}</Button>
            </Link>
          </div>
        </Modal>
      )}
    </form>
  );
};

export default InstrumentForm;
