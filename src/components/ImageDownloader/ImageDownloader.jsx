import { useState, useEffect } from 'react';
import styles from './ImageDownloader.module.css';
import Button from '../Button/Button';

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
      setError('Please upload a JPEG or PNG image.');
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
        alt={imageFile ? imageFile.name : 'Placeholder image'}
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
        <p className={styles.text}>
          Upload PNG or JPG picture, 500x500 max with removed background
        </p>
        {imageFile && (
          <div className={styles.fileInfo}>
            <Button onClick={handleDeleteFile} secondary className={styles.deleteButton}>
              Delete File
            </Button>
          </div>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageDownloader;
