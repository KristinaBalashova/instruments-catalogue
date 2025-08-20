import { useState, useEffect, useContext, useCallback } from 'react';
import cx from 'classnames';

import { supabase } from '../../helpers/supabaseClient';
import { USER_MESSAGES, THEME_DARK, STATUS_FAIL } from '../../strings';
import useUploadImage from '../../hooks/useUploadImage';
import ImageDownloader from '../../components/InstrumentImage/components/ImageDownloader/ImageDownloader';
import { StatusInfo } from '../../components/ui';
import { SectionLayout } from '../../components/layouts';
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

  const handleImageUpload = useCallback((file) => {
    setImageFile(file);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewInstrument((prevInstrument) => ({
      ...prevInstrument,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isSubmitable) return;

      setLoading(true);

      const { error } = await supabase
        .from('instruments_collection')
        .insert(newInstrument)
        .select();

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
    },
    [newInstrument, isSubmitable],
  );

  const resetForm = useCallback(() => {
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
  }, []);

  return (
    <SectionLayout>
      <div className={cx(styles.container, theme === THEME_DARK && styles.darkTheme)}>
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
          {error && <StatusInfo status={STATUS_FAIL}>{error}</StatusInfo>}
        </div>
        <div className={styles.imageContainer}>
          <ImageDownloader setFile={handleImageUpload} />
        </div>
      </div>
    </SectionLayout>
  );
};

export default InstrumentCreator;
