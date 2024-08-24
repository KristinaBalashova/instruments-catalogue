import { useState, useEffect } from 'react';
import { supabase } from '../../helpers/supabaseClient';
import { USER_MESSAGES } from '../../strings';
import useUploadImage from '../../hooks/useUploadImage';
import { Button, ImageDownloader, StatusInfo, Input } from '../../components';
import styles from './InstrumentCreator.module.css';

const dataStub = {
  name: '',
  description: '',
  image: '',
  type: '',
  date: '',
  brand: '',
  country: '',
  materials: '',
};

const InstrumentCreator = () => {
  const [newInstrument, setNewInstrument] = useState({ ...dataStub });
  const [imageFile, setImageFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
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

  const handleCheckboxChange = (e) => {
    setIsConfirmed(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      setError('You must confirm before submitting.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('instruments_collection').insert(newInstrument).select();

    if (error) {
      setError(error.message);
      setIsSuccess(false);
    } else {
      setIsSuccess(true);
      setError(null);
    }

    setLoading(false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.editContainer}>
          <h2>{USER_MESSAGES.ADD_INSTRUMENT}</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(dataStub).map((item) => {
              if (item === 'image') return null;
              return (
                <Input
                  id={item}
                  type="text"
                  name={item}
                  value={newInstrument[item]}
                  onChange={handleChange}
                  required
                  label={USER_MESSAGES[item.toUpperCase()] || item}
                  key={item}
                />
              );
            })}
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="confirmation"
                checked={isConfirmed}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
              />
              <label htmlFor="confirmation" className={styles.checkboxLabel}>
                {USER_MESSAGES.CONFIRMATION_LABEL}
              </label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : USER_MESSAGES.SAVE}
            </Button>
          </form>
          {isSuccess && (
            <StatusInfo status="success">{USER_MESSAGES.STATUS.SAVE_SUCCESS}</StatusInfo>
          )}
          {error && <StatusInfo status="fail">{error}</StatusInfo>}
        </div>
        <div className={styles.imageContainer}>
          <ImageDownloader setFile={setImageFile} />
          {errorUpload && <StatusInfo status="fail">{USER_MESSAGES.errors.uploadError}</StatusInfo>}
        </div>
      </div>
    </div>
  );
};

export default InstrumentCreator;