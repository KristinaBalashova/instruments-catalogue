import React from 'react';
import styles from './ErrorFallback.module.css';
import { Button } from '../';

const ErrorFallback = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Something went wrong</h1>
      <Button secondary onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  );
};

export default ErrorFallback;
