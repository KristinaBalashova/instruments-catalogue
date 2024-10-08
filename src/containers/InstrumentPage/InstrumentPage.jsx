import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cx from 'classnames';

import { supabase } from '../../helpers/supabaseClient';
import { ROLE_ADMIN, STATUS_FAIL, USER_MESSAGES, THEME_DARK } from '../../strings';
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
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const [editableItem, setEditableItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { fetchedItem, errorFetch } = useFetchItem(id);
  const { signedUrl, isSubmitable } = useUploadImage(imageFile, 'pics');
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
    [editableItem, signedUrl, id],
  );

  const handleDelete = async () => {
    const successCallback = () => {
      setEditableItem(null);
      navigate('/');
    };
    await deleteItem(id, successCallback);
  };

  if (!fetchedItem) return <Loader />;
  if (!editableItem)
    return <StatusInfo status={STATUS_FAIL}>{USER_MESSAGES.NOTHING_FOUND}</StatusInfo>;
  if (errorFetch) return <StatusInfo status={STATUS_FAIL}>{errorFetch}</StatusInfo>;

  return (
    <section className={cx(styles.root, theme === THEME_DARK && styles.darkTheme)}>
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
          {user?.role === ROLE_ADMIN && (
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
            submitDisabled={!isSubmitable}
          />
        ) : (
          <InstrumentInfo data={editableItem} />
        )}
      </div>
      {error && <StatusInfo status={STATUS_FAIL}>{error}</StatusInfo>}
    </section>
  );
};

export default InstrumentPage;
