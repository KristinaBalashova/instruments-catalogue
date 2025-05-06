import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import toast from 'react-hot-toast';

import { supabase } from '../../helpers/supabaseClient';
import { ROLE_ADMIN, THEME_DARK } from '../../strings';
import { UserContext, ThemeContext } from '../../context';

import { useFetchItem, useUploadImage, useDeleteItem } from '../../hooks';

import {
  ImageDownloader,
  EditorButtons,
  Loader,
  InstrumentForm,
  InstrumentInfo,
  SectionLayout,
} from '../../components';

import styles from './InstrumentPage.module.css';

const InstrumentPage = ({ isEditable = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const [editableItem, setEditableItem] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { fetchedItem, errorFetch } = useFetchItem(id);
  const { signedUrl, isSubmitable } = useUploadImage(imageFile, 'pics');
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();

  useEffect(() => {
    if (fetchedItem) {
      setEditableItem(fetchedItem);
    } else if (errorFetch) {
      toast.error(`Fetching failed: ${errorFetch}`);
    }
  }, [fetchedItem, errorFetch]);

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
          toast.success('Instrument updated successfully!');
        }
      } catch (error) {
        setError(error.message);
        toast.error(`Error updating instrument: ${error.message}`);
      }
    },
    [editableItem, signedUrl, id],
  );

  const handleDelete = async () => {
    const successCallback = () => {
      setEditableItem(null);
      navigate('/');
      toast.success('Instrument deleted successfully!');
    };
    await deleteItem(id, successCallback);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Changes saved successfully!');
    }
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [isSuccess, error]);

  if (!fetchedItem) return <Loader />;

  return (
    <SectionLayout>
      <div className={cx(styles.container, theme === THEME_DARK && styles.darkTheme)}>
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
        <div className={styles.infoContainer}>
        {editableItem && isEditable ? (
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
      </div>
    </SectionLayout>
  );
};

export default InstrumentPage;
