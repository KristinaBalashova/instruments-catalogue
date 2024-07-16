import React from 'react';
import styles from './InstrumentEditor.module.css/';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const InstrumentEditor = () => {
  return (
    <>
      <Header />
      <section className={styles.root}>
        <div className={styles.container}>
          <div className={styles.imgContainer}>
            <img src="./musician.png"></img>
          </div>
          <div className={styles.descriptionContainer}>
            <div className={styles.itemInfo}>
              <h2 className={styles.title}>Stratocaster RockEt ST-01</h2>
              <p className={styles.description}>
                Краткое описание инструмента, его особенностей и характеристик
              </p>

              <div className={styles.itemContainer}>
                <p className={styles.text}>Тип</p>
                <p className={styles.text}>Духовой</p>
              </div>
              <div className={styles.itemContainer}>
                <p className={styles.text}>Производитель</p>
                <p className={styles.text}>Мастер</p>
              </div>
              <div className={styles.itemContainer}>
                <p className={styles.text}>Дата</p>
                <p className={styles.text}>Дата</p>
              </div>
              <div className={styles.itemContainer}>
                <p className={styles.text}>Страна</p>
                <p className={styles.text}>Страна</p>
              </div>
              <div className={styles.itemContainer}>
                <p className={styles.text}>Материалы</p>
                <p className={styles.text}>Дерево</p>
              </div>
            </div>

            <div className={styles.buttons}>
              <button className={styles.button}>Add to Favorits</button>
              <button className={styles.button}>Redact</button>
              <button className={styles.button}>Delete</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default InstrumentEditor;
