import { useState } from 'react';
import styles from './ImageDownloader.module.css';
import Button from '../Button/Button';

const ImageDownloader = ({ setFile }) => {
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png'];

    if (file && validTypes.includes(file.type)) {
      setFile(file);
      setFileName(file.name);
      setError('');
    } else {
      setError('Please upload a JPEG or PNG image.');
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setFileName('');
    setError('');
  };

  return (
    <div className={styles.root}>
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
        {fileName && (
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
