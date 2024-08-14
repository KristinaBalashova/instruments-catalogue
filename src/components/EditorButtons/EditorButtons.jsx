import { Link } from 'react-router-dom';
import styles from './EditorButtons.module.css';
import Modal from '../Modal/Modal';
import { useState } from 'react';
import Button from '../Button/Button';
import { StatusInfo } from '../StatusInfo/StatusInfo';

const EditorButtons = ({ id, onDelete, statusDelete, errorDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    onDelete(id);
  };

  return (
    <>
      <div className={styles.editorButtons}>
        <Link to={`/instrument-editor/${id}`} state={{ id }} className={styles.link}>
          <div className={styles.edit}>Edit</div>
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
          header="Are you sure you want to delete this instrument?"
          appElement={document.getElementById('root') || undefined}
        >
          {statusDelete ? (
            <StatusInfo status="success">Instrument deleted successfully!</StatusInfo>
          ) : (
            <div className={styles.modalButtons}>
              <Button onClick={handleConfirmDelete}>Yes, delete</Button>
              <Button onClick={() => setIsModalOpen(false)}>No, cancel</Button>
            </div>
          )}
          {errorDelete && <div className={styles.error}>Error deleting data: {errorFetch}</div>}
        </Modal>
      )}
    </>
  );
};

export default EditorButtons;
