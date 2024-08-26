import React, { useState, useEffect, useContext } from 'react';
import cx from 'classnames';

import { supabase } from '../../helpers/supabaseClient';
import { SERVER_MESSAGES, USER_MESSAGES } from '../../strings';
import useUploadImage from '../../hooks/useUploadImage';

import { ImageDownloader, StatusInfo } from '../../components';
import { ThemeContext } from '../../context';

import styles from './InstrumentCreator.module.css';
import InstrumentForm from '../../components/InstrumentForm/InstrumentForm';

const InstrumentCreator = () => {
  const [newInstrument, setNewInstrument] = useState({
    name: '',
    description: '',
    image: '',
    type: '',
    date: '',
    brand: '',
    country: '',
    materials: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { signedUrl, isSubmitable } = useUploadImage(imageFile, 'pics');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (signedUrl) {
      setNewInstrument((prevInstrument) => ({
        ...prevInstrument,
        image: signedUrl,
      }));
    }
  }, [signedUrl]);

  const handleImageUpload = (file) => {
    setImageFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInstrument({
      ...newInstrument,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSubmitable) return;

    setLoading(true);

    const { error } = await supabase.from('instruments_collection').insert(newInstrument).select();

    if (error) {
      setError(error.message);
    } else {
      setIsSuccess(true);

      setTimeout(() => {
        resetForm();
        setError(null);
      }, 5000);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setNewInstrument({
      name: '',
      description: '',
      image: '',
      type: '',
      date: '',
      brand: '',
      country: '',
      materials: '',
    });
    setImageFile(null);
    setIsSuccess(false);
  };

  return (
    <section className={cx(styles.root, styles.link, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <div className={styles.editContainer}>
          <h2 className={styles.title}>{USER_MESSAGES.ADD_INSTRUMENT}</h2>
          <InstrumentForm
            data={newInstrument}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLoading={loading}
            isSuccess={isSuccess}
            submitDisabled={!isSubmitable}
          />
          {error && <StatusInfo status="fail">{error}</StatusInfo>}
        </div>
        <div className={styles.imageContainer}>
          <ImageDownloader setFile={handleImageUpload} />
        </div>
      </div>
    </section>
  );
};

export default InstrumentCreator;
