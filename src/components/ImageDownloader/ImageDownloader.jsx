import { useState, useEffect } from 'react';

import { strings } from '../../strings';

import Button from '../Button/Button';

import styles from './ImageDownloader.module.css';

const ImageDownloader = ({ setFile, image = '/blank-image.png' }) => {
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [objectURL, setObjectURL] = useState('');

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setObjectURL(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFile(file);
      setImageFile(file);
      setError(null);
    } else {
      setError(strings.formatError);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setImageFile(null);
    setObjectURL('');
    setError(null);
  };

  return (
    <div className={styles.root}>
      <img
        src={imageFile ? objectURL : image}
        alt={imageFile ? imageFile.name : strings.placehilderImg}
        className={styles.imagePreview}
      />
      <label>Upload image:</label>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
        className={styles.input}
      />
      <div className={styles.infoContainer}>
        <p className={styles.text}>{strings.uploadRules}</p>
        {imageFile && (
          <div className={styles.fileInfo}>
            <Button onClick={handleDeleteFile} secondary className={styles.deleteButton}>
              {strings.delete}
            </Button>
          </div>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageDownloader;
