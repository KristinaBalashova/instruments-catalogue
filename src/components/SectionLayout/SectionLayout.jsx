import React from 'react';
import styles from './SectionLayout.module.css';

const SectionLayout = ({ children }) => {
  return <section className={styles.root}>{children}</section>;
};

export default SectionLayout;
