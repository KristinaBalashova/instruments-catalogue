import React, { useEffect, useState, useCallback } from 'react';
import styles from './InstrumentPage.module.css';
import EditorButtons from '../EditorButtons/EditorButtons';
import { useParams } from 'react-router-dom';
import ImageDownloader from '../ImageDownloader/ImageDownloader';
import Button from '../Button/Button';
import { StatusInfo } from '../StatusInfo/StatusInfo';
import Loader from '../Loader/Loader';
import useFetchItem from '../../hooks/useFetchItem';
import { supabase } from '../../supabaseClient';
import useUploadImage from '../../hooks/useUploadImage';

const InstrumentPage = ({ isEditable = false }) => {
  const { id } = useParams();
  const [editableItem, setEditableItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const { fetchedItem, statusFetch, errorFetch } = useFetchItem(id);
  const { signedUrl, statusUpload, errorUpload } = useUploadImage(imageFile, 'pics');

  useEffect(() => {
    if (statusFetch) {
      setEditableItem(fetchedItem);
    }
  }, [statusFetch, fetchedItem]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditableItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (statusUpload === null) {
      alert('Please upload an image before saving.');
      return;
    }

    if (errorUpload) {
      alert(`Image upload failed. ${errorUpload} Please try again.`);
      return;
    }

    try {
      const updatedItem = { ...editableItem, image: signedUrl };

      const { error: updateError } = await supabase
        .from('instruments_collection')
        .update(updatedItem)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      alert('Instrument data updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      setError(`Error updating instrument data: ${error.message}`);
    }
  }, [editableItem, signedUrl, statusUpload, id]);

  if (!statusFetch) return <Loader />;

  if (errorFetch) return <StatusInfo status="fail">{errorFetch}</StatusInfo>;

  const renderInputField = (title, data) => (
    <div key={title} className={styles.descriptionContainer}>
      <p className={styles.description}>
        <span className={styles.title}>{title}:</span>
        {isEditable ? (
          <input
            type="text"
            name={title}
            value={data}
            onChange={handleInputChange}
            className={styles.input}
          />
        ) : (
          data
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
          <EditorButtons id={id} />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.content}>
            <h1 className={styles.name}>
              <span className={styles.title}>Name:</span>
              {isEditable ? (
                <input
                  type="text"
                  name="name"
                  value={editableItem?.name || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                editableItem?.name
              )}
            </h1>
            {editableItem &&
              ['brand', 'description', 'country', 'materials', 'type', 'date'].map((title) =>
                renderInputField(title, editableItem[title]),
              )}
            {isEditable && <Button onClick={handleSave}>Save Changes</Button>}
          </div>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default InstrumentPage;
