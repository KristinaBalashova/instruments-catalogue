import logo from '/logo.png';
import styles from './Header.module.css';
import HeartSymbol from '../HeartSymbol/HeartSymbol';
import { Link } from 'react-router-dom';

const Header = ({ nightMode }) => {
  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <Link to="/">
          <img src={logo} className={styles.logo} alt="logo" />
        </Link>

        <div className={styles.right}>
          <Link to="/favorites">
            <HeartSymbol filled />
          </Link>

          {nightMode ? <span>&#127769;</span> : <span>&#9728;</span>}
        </div>
      </div>
    </section>
  );
};

export default Header;
('/');
