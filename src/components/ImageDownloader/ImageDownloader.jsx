import { useState } from 'react';
import styles from './ImageDownloader.module.css';

const ImageDownloader = ({ setFile }) => {
  const [error, setError] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png'];

    if (file && validTypes.includes(file.type)) {
      setFile(file);
      setError('');
    } else {
      setError('Please upload a JPEG or PNG image.');
    }
  };

  return (
    <div className={styles.root}>
      <label>Download image:</label>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
        className={styles.input}
      />
      <p className={styles.text}>
        Download PNG or JPG picture, 500x500 max with removed background
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageDownloader;
