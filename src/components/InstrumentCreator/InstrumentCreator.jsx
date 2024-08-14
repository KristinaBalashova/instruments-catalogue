import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './InstrumentCreator.module.css';
import Button from '../Button/Button';
import ImageDownloader from '../ImageDownloader/ImageDownloader';
import useUploadImage from '../../hooks/useUploadImage';

const dataStub = {
  name: 'Name of the best music instrument',
  description: 'Description for the best music instrument',
  image: '',
  type: 'String',
  date: '10.10.2024',
  brand: 'Brand',
  country: 'Country',
  materials: 'Wood, Metal',
};

const InstrumentCreator = () => {
  const [newInstrument, setNewInstrument] = useState({ ...dataStub });
  const [imageFile, setImageFile] = useState(null);
  const { signedUrl, statusUpload, errorUpload } = useUploadImage(imageFile, 'pics');

  useEffect(() => {
    if (signedUrl) {
      setNewInstrument((prevInstrument) => ({
        ...prevInstrument,
        image: signedUrl,
      }));
    }
  }, [signedUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInstrument({
      ...newInstrument,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (statusUpload === null) {
      alert('Please upload an image before saving.');
      return;
    }

    if (statusUpload === false) {
      alert('Image upload failed. Please try again.');
      return;
    }

    const { error } = await supabase.from('instruments_collection').insert(newInstrument).select();

    if (error) {
      console.error('Error inserting instrument:', error);
      alert('Failed to save instrument data.');
    } else {
      alert('Instrument data saved successfully!');
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.editContainer}>
          <h2>Add New Instrument</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(dataStub).map((item) => {
              if (item === 'image') return null;
              return (
                <div key={item}>
                  <label>{item}:</label>
                  <input
                    type="text"
                    name={item}
                    value={newInstrument[item]}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
              );
            })}
            <Button type="submit">Save</Button>
          </form>
        </div>
        <div className={styles.imageContainer}>
          <ImageDownloader setFile={setImageFile} />
        </div>
        {errorUpload && <p className={styles.error}>Error uploading image: {errorUpload}</p>}
      </div>
    </div>
  );
};

export default InstrumentCreator;
