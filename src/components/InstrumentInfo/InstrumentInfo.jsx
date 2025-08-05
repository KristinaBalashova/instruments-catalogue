import styles from './InstrumentInfo.module.css';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

const InstrumentInfo = ({ data }) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>{data.name}</h2>
        <FavoriteButton id={data.id} />
      </div>
      
      <div className={styles.container}>
        {['brand', 'description', 'country', 'materials', 'type', 'date'].map((item) => (
          <p key={item} className={styles.item}>
            <span className={styles.name}>
              {item.charAt(0).toUpperCase() + item.slice(1)}:
            </span>
            {data[item]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default InstrumentInfo;
