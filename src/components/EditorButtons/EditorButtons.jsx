import { Link } from 'react-router-dom';
import styles from './EditorButtons.module.css';
import Modal from '../Modal/Modal';
import { supabase } from '../../supabaseClient';
import { useState } from 'react';
import Button from '../Button/Button';

const EditorButtons = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorFetch, setErrorFetch] = useState(null);

  const handleDeleteButton = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const { data, error } = await supabase.from('instruments_collection').delete().eq('id', id);

    if (error) {
      console.log(error);
    } else {
      console.log('Data deleted:', data);
      setIsModalOpen(false);
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
          ariaHideApp={false}
        >
          <Button onClick={handleConfirmDelete}>Yes, delete</Button>
          <Button onClick={() => setIsModalOpen(false)}>No, cancel</Button>
          {/*errorFetch && <div>'Error deleting data:', {errorFetch}</div>*/}
        </Modal>
      )}
    </>
  );
};

export default EditorButtons;
