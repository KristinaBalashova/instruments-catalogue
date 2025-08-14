import { USER_MESSAGES } from '../../strings';
import styles from './ImageDownloader.module.css';
import { Button } from '../ui';

import { useRef, useState, useEffect } from 'react';

const ImageDownloader = ({ setFile, name, image }) => {
  const imageRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleUploadClick = () => {
    imageRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPreview(null);
      setError('');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (PNG or JPEG)');
      setPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setPreview(null);
      return;
    }

    setError('');
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreview(fileReader.result);
      setFile(file);
    };

    fileReader.onerror = () => {
      setError('Error reading file');
    };

    fileReader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      setPreview(null);
      setError('');
    };
  }, []);

  return (
    <div className={styles.root}>
      {image || preview ? (
        <img src={preview ? preview : image} alt="avatar" className={styles.img} />
      ) : null}
      <label htmlFor={name}>{USER_MESSAGES.UPLOAD_INFO}</label>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.container}>
        <Button secondary onClick={handleUploadClick} type="button" aria-label="Pick an image">
          Pick image
        </Button>
        <input
          className={styles.input}
          type="file"
          ref={imageRef}
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          onChange={handleFileChange}
          required
          hidden
        />
      </div>
    </div>
  );
};

export default ImageDownloader;
