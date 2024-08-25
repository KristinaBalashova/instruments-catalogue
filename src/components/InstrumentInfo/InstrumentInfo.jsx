const InstrumentInfo = ({ data }) => {
  return (
    <div>
      <h1 className={styles.name}>{data.name}</h1>
      {['brand', 'description', 'country', 'materials', 'type', 'date'].map((title) => (
        <div key={title} className={styles.descriptionContainer}>
          <p className={styles.description}>
            <span>{title.charAt(0).toUpperCase() + title.slice(1)}: </span>
            {[title]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InstrumentInfo;
