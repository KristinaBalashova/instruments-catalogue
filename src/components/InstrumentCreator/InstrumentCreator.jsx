import { useState, useEffect } from 'react';

import { supabase } from '../../helpers/supabaseClient';
import { strings } from '../../strings';

import useUploadImage from '../../hooks/useUploadImage';

import Button from '../Button/Button';
import ImageDownloader from '../ImageDownloader/ImageDownloader';

import styles from './InstrumentCreator.module.css';

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

  const { signedUrl, errorUpload } = useUploadImage(imageFile, 'pics');

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

    const { error } = await supabase.from('instruments_collection').insert(newInstrument).select();

    if (error) {
      alert(string.errors.saveSuccess, error);
    } else {
      alert(strings.status.saveSuccess);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.editContainer}>
          <h2>{strings.addInstrument}</h2>
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
            <Button type="submit">{strings.save}</Button>
          </form>
        </div>
        <div className={styles.imageContainer}>
          <ImageDownloader setFile={setImageFile} />
        </div>
        {errorUpload && (
          <p className={styles.error}>
            {strings.uploadError} {errorUpload}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstrumentCreator;
