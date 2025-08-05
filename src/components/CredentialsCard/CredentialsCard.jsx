import { useState } from 'react';
import styles from './CredentialsCard.module.css';

const CredentialsCard = () => {
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Test Credentials</h3>

      <div className={styles.block}>
        <h5>Admin user:</h5>
        <p>
          <strong>Email:</strong> admainemail1222@gmail.com
          <button
            onClick={() => handleCopy('admainemail1222@gmail.com')}
            className={styles.copyBtn}
          >
            📋
          </button>
        </p>
        <p>
          <strong>Password:</strong> 12345678
          <button onClick={() => handleCopy('12345678')} className={styles.copyBtn}>
            📋
          </button>
        </p>
      </div>

      <div className={styles.block}>
        <h5>Reader user:</h5>
        <p>
          <strong>Email:</strong> readeremail@gmail.com
          <button onClick={() => handleCopy('readeremail@gmail.com')} className={styles.copyBtn}>
            📋
          </button>
        </p>
        <p>
          <strong>Password:</strong> 12345678
          <button onClick={() => handleCopy('12345678')} className={styles.copyBtn}>
            📋
          </button>
        </p>
      </div>

      {copiedText && <span className={styles.copied}>Copied!</span>}
    </div>
  );
};

export default CredentialsCard;
