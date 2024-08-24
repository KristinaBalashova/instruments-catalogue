import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { supabase } from '../../helpers/supabaseClient';
import { USER_MESSAGES } from '../../strings';
import { UserContext } from '../../context';

import useFetchItem from '../../hooks/useFetchItem';
import useUploadImage from '../../hooks/useUploadImage';
import useDeleteItem from '../../hooks/useDeleteItem';

import {
  Button,
  ImageDownloader,
  EditorButtons,
  StatusInfo,
  Loader,
  Input,
  Modal,
} from '../../components';

import styles from './InstrumentPage.module.css';

const InstrumentPage = ({ isEditable = false }) => {
  const { id } = useParams();

  const { user } = useContext(UserContext);

  const [editableItem, setEditableItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fetchedItem, errorFetch } = useFetchItem(id);
  const { signedUrl, errorUpload } = useUploadImage(imageFile, 'pics');
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();

  useEffect(() => {
    if (fetchedItem) {
      setEditableItem(fetchedItem);
    }
  }, [fetchedItem]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditableItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (errorUpload) {
      alert(errorUpload);
      return;
    }

    try {
      const updatedItem = {
        ...editableItem,
        image: signedUrl || editableItem.image,
      };

      const { error: updateError } = await supabase
        .from('instruments_collection')
        .update(updatedItem)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      setError(error.message);
    }
  }, [editableItem, signedUrl, id, errorUpload]);

  const handleDelete = async () => {
    const successCallback = () => {
      setEditableItem(null);
    };
    await deleteItem('instruments_collection', id, successCallback);
  };

  if (!fetchedItem) return <Loader />;
  if (!editableItem) return <StatusInfo status="fail">No avaliable data</StatusInfo>;
  if (errorFetch) return <StatusInfo status="fail">{errorFetch}</StatusInfo>;

  const renderInputField = (title, data) => (
    <div key={title} className={styles.descriptionContainer}>
      <p className={styles.description}>
        {isEditable ? (
          <Input
            type="text"
            name={title}
            value={data || ''}
            onChange={handleInputChange}
            label={title}
          />
        ) : (
          <>
            <span>{title}: </span>
            {data}
          </>
        )}
      </p>
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          {isEditable ? (
            <ImageDownloader setFile={setImageFile} image={editableItem?.image} />
          ) : (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : editableItem?.image}
              alt={editableItem?.name}
              className={styles.image}
            />
          )}
          {user?.role === 'admin' && (
            <EditorButtons
              id={id}
              onDelete={handleDelete}
              statusDelete={statusDelete}
              errorDelete={errorDelete}
            />
          )}
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.content}>
            <h1 className={styles.name}>
              {isEditable ? (
                <Input
                  type="text"
                  name="name"
                  value={editableItem?.name || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  label={'name'}
                />
              ) : (
                editableItem?.name
              )}
            </h1>
            {editableItem &&
              ['brand', 'description', 'country', 'materials', 'type', 'date'].map((title) =>
                renderInputField(title, editableItem[title]),
              )}
            {isEditable && <Button onClick={handleSave}>{USER_MESSAGES.SAVE}</Button>}
          </div>
        </div>
      </div>
      {error && <StatusInfo status="fail">{error}</StatusInfo>}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appElement={document.getElementById('root') || undefined}
        >
          <StatusInfo status="success">{USER_MESSAGES.STATUS.SAVE_SUCCESS}</StatusInfo>
          <div className={styles.modalButtons}>
            <Button onClick={() => setIsModalOpen(false)}>Stay here</Button>
            <Link to="/">
              <Button>Return to the main page</Button>
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InstrumentPage;
