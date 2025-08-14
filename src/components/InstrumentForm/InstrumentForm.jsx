import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input, Modal } from '../ui';
import styles from './InstrumentForm.module.css';
import { USER_MESSAGES } from '../../strings';

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
      <Button type="submit" disabled={(isLoading || submitDisabled) && true}>
        {USER_MESSAGES.SAVE}
      </Button>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appElement={document.getElementById('root') || undefined}
        >
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
