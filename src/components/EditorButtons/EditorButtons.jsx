import { Link } from 'react-router-dom';
import styles from './EditorButtons.module.css';
import Modal from '../Modal/Modal';
import { supabase } from '../../supabaseClient';
import { useState } from 'react';
import Button from '../Button/Button';
const EditorButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteButton = () => {
    console.log(id, 'id');
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log('we are here');
    console.log('id', id);
    const { data, error } = await supabase.from('instruments-collection').delete().eq('id', id);

    if (error) {
      console.error('Error deleting data:', error);
    } else {
      console.log('Data deleted:', data);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className={styles.editorButtons}>
        <Link to="/instrument-editor" className={styles.link}>
          <span className={styles.edit}>&#9998;</span>
        </Link>
        <span className={styles.edit} onClick={handleDeleteButton}>
          &#128465;
        </span>
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
        </Modal>
      )}
    </>
  );
};

export default EditorButtons;
