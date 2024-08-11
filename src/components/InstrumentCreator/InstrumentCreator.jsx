import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './InstrumentCreator.module.css';
import { Button } from 'antd';
import ImageDownloader from '../ImageDownloader/ImageDownloader';

const dataStub = {
  name: 'Name fo the best music intrument',
  description: 'Description for the best music intrument',
  image: '/pic-stub.jpg',
  type: 'Description for the best music intrument',
  country: 'Description for the best music intrument',
  type: 'Description for the best music intrument',
};
const InstrumentCreator = () => {
  const [name, setName] = useState(dataStub.name);
  const [description, setDescription] = useState(dataStub.description);
  const [image, setImage] = useState(dataStub.img);
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [brand, setBrand] = useState('');
  const [country, setCountry] = useState('');
  const [materials, setMaterials] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);
  const handleSubmit = () => {
    if (!isConfirmed) {
      setConfirmationError(true);
    }
  };

  const data = [name, description, type, date, brand, country, materials];
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.editContainer}>
          <h2>Edit Instrument</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={styles.text}
              ></textarea>
            </div>
            <div>
              <label>Type:</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div>
              <label>Date:</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div>
              <label>Brand:</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div>
              <label>Country:</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div>
              <label>Materials:</label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <Button onClick={handleSubmit}>Save</Button>
            {confirmationError && 'Проверьте указанные данные и подтвердите'}
          </form>
        </div>
        <div className={styles.resultContainer}>
          <img src="/pic-stub.png" className={styles.logo} alt="pic" />
          <ImageDownloader />
          <p>'Name fo the best music intrument'</p>
          <p>'Name fo the best music intrument'</p>
          <p>'Name fo the best music intrument'</p>
          <p>'Name fo the best music intrument'</p>

          <div onClick={setIsConfirmed} class="checkbox-container">
            <input type="checkbox" id="vintageCheckbox" class="vintage-checkbox" />
            <label for="vintageCheckbox" class="vintage-checkbox-label">
              Confirm data
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentCreator;
