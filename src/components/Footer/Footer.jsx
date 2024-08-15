import styles from './Footer.module.css';
import { strings } from '../../strings';

const Footer = () => {
  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <p>{strings.createdBy}</p>
      </div>
    </section>
  );
};

export default Footer;
