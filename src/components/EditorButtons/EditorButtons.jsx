import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoTrash } from 'react-icons/io5';

import { USER_MESSAGES, STATUS_FAIL } from '../../strings';
import { Modal, Button, StatusInfo } from '../';

import styles from './EditorButtons.module.css';

const EditorButtons = ({ id, onDelete, errorDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    onDelete(id);
  };

  return (
    <>
      <div className={styles.editorButtons}>
        <Link to={`/instrument-editor/${id}`} state={{ id }} className={styles.link}>
          <div className={styles.edit}>{USER_MESSAGES.EDIT}</div>
        </Link>
        <IoTrash className={styles.delete} onClick={() => setIsModalOpen(true)} />
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          header={USER_MESSAGES.CONFIRM_DELETE}
          appElement={document.getElementById('root') || undefined}
        >
          <div className={styles.modalButtons}>
            <Button onClick={handleConfirmDelete}>{USER_MESSAGES.YES_DELETE}</Button>
            <Button onClick={() => setIsModalOpen(false)}>{USER_MESSAGES.CANCEL_DELETE}</Button>
          </div>
          {errorDelete && <StatusInfo status={STATUS_FAIL}>{errorDelete}</StatusInfo>}
        </Modal>
      )}
    </>
  );
};

export default EditorButtons;
