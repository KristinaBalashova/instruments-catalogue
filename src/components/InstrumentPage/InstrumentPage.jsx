import React from 'react';
import styles from './InstrumentPage.module.css';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';

const InstrumentPage = ({props}) => {

  const location = useLocation();
  const { instrumentData } = location.state || {};
  
  if (!instrumentData) {
    return <div>No instrument data available.</div>;
  }

  const { brand, country, date_produced, description, id, materials, name, picture_url, type} = instrumentData;

  const keysToExclude = [id, picture_url];

  return (
    <>
    <Header />
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src={picture_url} alt={name} className={styles.image} />
          
        </div>
        <div className={styles.detailsContainer}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.description}>{description}</p>
          <p className={styles.description}>{brand}</p>
          <p className={styles.description}>{country}</p>
          <p className={styles.description}>{materials}</p>
          <p className={styles.description}>{type}</p>
          {console.log(Object.keys(instrumentData))}
          <div className={styles.editorButtons}>
            <Link to="/instrument-edit" className={styles.link}>
              <span className={styles.edit}>&#9998;</span>
            </Link>
            <Link to="/instrument-creator" className={styles.link}>
              <span className={styles.delete}>&#128465;</span>
            </Link>
          </div>
        </div>
      </div>
      
    </div>
    <Footer />
    </>
  );
};

export default InstrumentPage;
