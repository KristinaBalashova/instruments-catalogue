import React, { useEffect, useState } from 'react';
import styles from './InstrumentPage.module.css';
import EditorButtons from '../EditorButtons/EditorButtons';
import { useParams } from 'react-router-dom';
import ImageDownloader from '../ImageDownloader/ImageDownloader';
import Button from '../Button/Button';
import { StatusInfo } from '../StatusInfo/StatusInfo';
import Loader from '../Loader/Loader';
import useFetchItem from '../../hooks/useFetchItem';
import { supabase

 } from '../../supabaseClient';
const InstrumentPage = ({ isEditable = false }) => {
  const { id } = useParams();
  const [editableItem, setEditableItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const[error, setError] = useState(null);
  const { fetchedItem, statusFetch, errorFetch } = useFetchItem(id);

  console.log(fetchedItem)
  useEffect(() => {
    if (statusFetch) {
      setEditableItem(fetchedItem);
    }
  }, [statusFetch, fetchedItem]);

  if (!statusFetch) {
    return <Loader />;
  }

  if (errorFetch) {
    return <StatusInfo status="fail">{errorFetch}</StatusInfo>;
  }

  const { brand, country, date, description, materials, name, image, type } = editableItem || {};

  const list = [
    { title: 'brand', data: brand },
    { title: 'description', data: description },
    { title: 'country', data: country },
    { title: 'materials', data: materials },
    { title: 'type', data: type },
    { title: 'date', data: date },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      let updatedItem = { ...editableItem };

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${id}.${fileExt}`;
        const filePath = `instruments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pics')
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }
        const { data: signedURLData, error: signedURLError } = await supabase.storage
          .from('pics')
          .createSignedUrl(filePath, 60 * 60 * 24);

        if (signedURLError) {
          throw signedURLError;
        }
        updatedItem.image = signedURLData.signedUrl;
      }

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
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : image}
            alt={name}
            className={styles.image}
          />
          {isEditable && <ImageDownloader setFile={setImageFile} />}
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
                  value={name}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                name
              )}
            </h1>
            {list.map(({ title, data }) => (
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
            ))}
            {isEditable && <Button onClick={handleSave}>Save Changes</Button>}
          </div>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default InstrumentPage;
