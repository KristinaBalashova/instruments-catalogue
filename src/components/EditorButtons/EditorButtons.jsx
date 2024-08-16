import { useState } from 'react';
import { Link } from 'react-router-dom';

import { strings } from '../../strings';

import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { StatusInfo } from '../StatusInfo/StatusInfo';

import styles from './EditorButtons.module.css';
const EditorButtons = ({ id, onDelete, statusDelete, errorDelete }) => {
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
        <img
          src="/trash-bin.png"
          className={styles.delete}
          alt="trash-bin-icon"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          header={strings.confirmDelete}
          appElement={document.getElementById('root') || undefined}
        >
          {statusDelete ? (
            <StatusInfo status="success">{strings.status.deleteSuccess}</StatusInfo>
          ) : (
            <div className={styles.modalButtons}>
              <Button onClick={handleConfirmDelete}>{strings.yesDelete}</Button>
              <Button onClick={() => setIsModalOpen(false)}>{strings.cancelDelete}</Button>
            </div>
          )}
          {errorDelete && (
            <div className={styles.error}>
              {strings.errorDelete} {errorFetch}
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default EditorButtons;
