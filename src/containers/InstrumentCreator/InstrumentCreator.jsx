import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { supabase } from '../../helpers/supabaseClient';
import { USER_MESSAGES } from '../../strings';
import useUploadImage from '../../hooks/useUploadImage';

import { Button, ImageDownloader, StatusInfo, Input, Modal } from '../../components';

import { ThemeContext } from '../../context';

import styles from './InstrumentCreator.module.css';

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
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { signedUrl, errorUpload } = useUploadImage(imageFile, 'pics');

  const { theme } = useContext(ThemeContext);

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
      setError(USER_MESSAGES.CONFIRMATION_REQUEST);
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('instruments_collection').insert(newInstrument).select();

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setIsModalOpen(true);
    }

    setLoading(false);
  };

  return (
    <section className={cx(styles.root, styles.link, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <div className={styles.editContainer}>
          <h2 className={styles.title}>{USER_MESSAGES.ADD_INSTRUMENT}</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(newInstrument).map((item) => {
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
              {USER_MESSAGES.SAVE}
            </Button>
          </form>
          {error && <StatusInfo status="fail">{error}</StatusInfo>}
        </div>
        <div className={styles.imageContainer}>
          <ImageDownloader setFile={setImageFile} />
          {errorUpload && <StatusInfo status="fail">{USER_MESSAGES.errors.uploadError}</StatusInfo>}
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appElement={document.getElementById('root') || undefined}
        >
          <StatusInfo status="success">{USER_MESSAGES.STATUS.SAVE_SUCCESS}</StatusInfo>
          <div className={styles.modalButtons}>
            <Button onClick={() => setIsModalOpen(false)}>{USER_MESSAGES.STAY}</Button>
            <Link to="/">
              <Button>{USER_MESSAGES.RETURN}</Button>
            </Link>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default InstrumentCreator;
