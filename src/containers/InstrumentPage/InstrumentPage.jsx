import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import toast from 'react-hot-toast';

import { supabase } from '../../helpers/supabaseClient';
import { ROLE_ADMIN, THEME_DARK } from '../../strings';
import { UserContext, ThemeContext } from '../../context';

import { useItem, useUploadImage, useDeleteItem } from '../../hooks';

import {
  EditorButtons,
  InstrumentForm,
  InstrumentInfo,
  InstrumentImage,
} from '../../components';

import { Loader } from '../../components/ui';
import { SectionLayout } from '../../components/layouts';

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

  const { data: fetchedItem, isLoading: isItemLoading, error: itemError } = useItem(id);

  const { signedUrl, isSubmitable } = useUploadImage(imageFile, 'pics');
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();

  useEffect(() => {
    if (fetchedItem) {
      setEditableItem(fetchedItem);
    } else if (itemError) {
      toast.error(`Fetching failed: ${itemError.message}`);
    }
  }, [fetchedItem, itemError]);

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

  if (isItemLoading) return <Loader />;

  return (
    <SectionLayout>
      <div className={cx(styles.container, theme === THEME_DARK && styles.darkTheme)}>
        <div className={styles.imageContainer}>
          <InstrumentImage isEditable={isEditable} imageFile={imageFile} editableItem={editableItem} setImageFile={setImageFile} />
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
