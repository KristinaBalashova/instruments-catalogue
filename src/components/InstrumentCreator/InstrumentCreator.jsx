import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './InstrumentCreator.module.css';
import Button from '../Button/Button';
import ImageDownloader from '../ImageDownloader/ImageDownloader';
import Modal from '../Modal/Modal';

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
  const [newInstrument, setNewInstrument] = useState({
    ...dataStub,
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInstrument({
      ...newInstrument,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsConfirmed(e.target.checked);
    if (e.target.checked) {
      setConfirmationError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConfirmed) {
      setConfirmationError(true);
      return;
    }
    // Submit logic goes here (e.g., sending data to the server)
    console.log('Submitting:', newInstrument);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.editContainer}>
          <h2>Add New Instrument</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(dataStub).map((item) => {
              if (item === 'image') return null; // Skip rendering the input for 'image'

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
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            {confirmationError && (
              <div className={styles.error}>Please check the data and confirm.</div>
            )}
          </form>
        </div>
        <div className={styles.imageContainer}>
          <img src={dataStub.image} className={styles.image} alt="instrument" />
          <ImageDownloader />
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="checkbox"
              checked={isConfirmed}
              onChange={handleCheckboxChange}
              className={styles.сheckbox}
            />
            <label htmlFor="checkbox" className={styles.сheckboxLabel}>
              Confirm data
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCreator;
