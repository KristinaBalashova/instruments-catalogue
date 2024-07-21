import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './InstrumentEditor.module.css';
import Button from '../Button/Button';

const InstrumentEditor = () => {
  const instrument = {};
  const [name, setName] = useState(instrument.name || '');
  const [description, setDescription] = useState(instrument.description || '');
  const [image, setImage] = useState(null);
  const [type, setType] = useState(instrument.type || '');
  const [date, setDate] = useState(instrument.date || '');
  const [brand, setBrand] = useState(instrument.brand || '');
  const [country, setCountry] = useState(instrument.country || '');
  const [materials, setMaterials] = useState(instrument.materials || '');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png'];

    if (file && validTypes.includes(file.type)) {
      setImage(file);
      setError('');
    } else {
      setError('Please upload a JPEG or PNG image.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Upload the image to Supabase storage
    if (image) {
      const { data, error: uploadError } = await supabase.storage
        .from('instruments')
        .upload(`public/${image.name}`, image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        setError('Error uploading image');
        return;
      }

      const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/instruments/${image.name}`;

      // Update instrument details in the database
      const { data: updatedInstrument, error: updateError } = await supabase
        .from('instruments-collection')
        .update({ name, description, picture_url: imageUrl })
        .eq('id', instrument.id);

      if (updateError) {
        console.error('Error updating instrument:', updateError);
        setError('Error updating instrument');
      } else {
        console.log('Instrument updated successfully:', updatedInstrument);
      }
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
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
            <label>Picture:</label>
            <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
          <Button>Save</Button>
        </form>
      </div>
    </div>
  );
};

export default InstrumentEditor;
