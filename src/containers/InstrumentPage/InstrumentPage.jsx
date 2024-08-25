import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cx from 'classnames';

import { supabase } from '../../helpers/supabaseClient';
import { USER_MESSAGES } from '../../strings';
import { UserContext, ThemeContext } from '../../context';

import useFetchItem from '../../hooks/useFetchItem';
import useUploadImage from '../../hooks/useUploadImage';
import useDeleteItem from '../../hooks/useDeleteItem';

import {
  ImageDownloader,
  EditorButtons,
  StatusInfo,
  Loader,
  InstrumentForm,
  InstrumentInfo,
} from '../../components';

import styles from './InstrumentPage.module.css';

const InstrumentPage = ({ isEditable = false }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Added useNavigate
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const [editableItem, setEditableItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
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
          setIsSuccess(true);
        }
      } catch (error) {
        setError(error.message);
      }
    },
    [editableItem, signedUrl, id, errorUpload],
  );

  const handleDelete = async () => {
    const successCallback = () => {
      setEditableItem(null);
      navigate('/'); // Navigate to the main page after deletion
    };
    await deleteItem(id, successCallback);
  };

  if (!fetchedItem) return <Loader />;
  if (!editableItem) return <StatusInfo status="fail">{USER_MESSAGES.NOTHING_FOUND}</StatusInfo>;
  if (errorFetch) return <StatusInfo status="fail">{errorFetch}</StatusInfo>;

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
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
        {isEditable ? (
          <InstrumentForm
            data={editableItem}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={false}
            isSuccess={isSuccess}
          />
        ) : (
          <InstrumentInfo data={editableItem} />
        )}
      </div>
      {error && <StatusInfo status="fail">{error}</StatusInfo>}
    </section>
  );
};

export default InstrumentPage;
