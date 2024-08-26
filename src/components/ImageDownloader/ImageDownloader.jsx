import { useState, useEffect } from 'react';
import { USER_MESSAGES } from '../../strings';
import styles from './ImageDownloader.module.css';

const ImageDownloader = ({ setFile, image = './blank-image.png' }) => {
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
    }
  };

  return (
    <div className={styles.root}>
      <img
        src={imageFile ? objectURL : image}
        alt={imageFile ? imageFile.name : USER_MESSAGES.PLACEHOLDER_IMG}
        className={styles.imagePreview}
      />
      <label>{USER_MESSAGES.IMG_UPLOAD}</label>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
        className={styles.input}
      />
      <div className={styles.infoContainer}>
        <p className={styles.text}>{USER_MESSAGES.UPLOAD_INFO}</p>
      </div>
    </div>
  );
};

export default ImageDownloader;
