import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './InstrumentCreator.module.css';
import Button from '../Button/Button';
import ImageDownloader from '../ImageDownloader/ImageDownloader';

const dataStub = {
  name: 'Name of the best music instrument',
  description: 'Description for the best music instrument',
  image: '/blank-image.png',
  type: 'String',
  date: '10.10.2024',
  brand: 'Brand',
  country: 'Country',
  materials: 'Wood, Metal',
};

const InstrumentCreator = () => {
  const [newInstrument, setNewInstrument] = useState({ ...dataStub });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInstrument({
      ...newInstrument,
      [name]: value,
    });
  };

  const handleImageUpdate = (newImageUrl) => {
    setNewInstrument((prevInstrument) => ({
      ...prevInstrument,
      image: newImageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', newInstrument);

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
          <img src={newInstrument.image} className={styles.image} alt="instrument" />
          <ImageDownloader setFile={handleImageUpdate} />
        </div>
      </div>
    </div>
  );
};

export default InstrumentCreator;
