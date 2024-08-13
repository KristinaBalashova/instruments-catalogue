import React, { useEffect, useState } from 'react';
import styles from './InstrumentPage.module.css';
import EditorButtons from '../EditorButtons/EditorButtons';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ImageDownloader from '../ImageDownloader/ImageDownloader';
import Button from '../Button/Button';
import { StatusInfo } from '../StatusInfo/StatusInfo';
import Loader from '../Loader/Loader';

const InstrumentPage = ({ isEditable = false }) => {
  let { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableItem, setEditableItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('instruments_collection')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching data:', error);
          setError('Error fetching instrument data.');
        } else {
          setItem(data);
          setEditableItem(data);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!item) {
    return <StatusInfo status="fail">No instrument data available.</StatusInfo>;
  }

  const { brand, country, date, description, materials, name, image, type } = editableItem;

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
        const filePath = `instruments/${fileName}`; // Adding a directory name like 'instruments'

        // Upload the image to the specified storage bucket
        const { error: uploadError } = await supabase.storage
          .from('pics') // Ensure 'pics' is the correct bucket name
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        // Generate a signed URL for the uploaded image
        const { data: signedURLData, error: signedURLError } = await supabase.storage
          .from('pics')
          .createSignedUrl(filePath, 60 * 60 * 24); // Signed URL valid for 24 hours

        if (signedURLError) {
          throw signedURLError;
        }

        // Use the signed URL
        updatedItem.image = signedURLData.signedUrl;
      }

      // Update the database with the new image URL and other changes
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
