import { Link } from 'react-router-dom';
import styles from './EditorButtons.module.css';
import Modal from '../Modal/Modal';
import { supabase } from '../../supabaseClient';
import { useState } from 'react';
import Button from '../Button/Button';
import { StatusInfo } from '../StatusInfo/StatusInfo';

const EditorButtons = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorFetch, setErrorFetch] = useState(null);
  const [statusDelete, setStatusDelete] = useState(true);

  const handleDeleteButton = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const { data, error } = await supabase
      .from('instruments_collection')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(error);
      setStatusDelete(false);
      setErrorFetch('Error deleting data');
    } else {
      console.log('Data deleted:', data);
      setStatusDelete(true);

      
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }
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
          onClick={handleDeleteButton}
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
          {errorFetch && <div className={styles.error}>Error deleting data: {errorFetch}</div>}
        </Modal>
      )}
    </>
  );
};

export default EditorButtons;