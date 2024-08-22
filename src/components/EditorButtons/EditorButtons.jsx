import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoTrash } from 'react-icons/io5';

import { strings } from '../../strings';

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
          <div className={styles.edit}>{strings.edit}</div>
        </Link>
        <IoTrash className={styles.delete} onClick={() => setIsModalOpen(true)} />
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          header={strings.confirmDelete}
          appElement={document.getElementById('root') || undefined}
        >
          <div className={styles.modalButtons}>
            <Button onClick={handleConfirmDelete}>{strings.yesDelete}</Button>
            <Button onClick={() => setIsModalOpen(false)}>{strings.cancelDelete}</Button>
          </div>
          {errorDelete && <StatusInfo status="fail">{errorDelete}</StatusInfo>}
        </Modal>
      )}
    </>
  );
};

export default EditorButtons;
