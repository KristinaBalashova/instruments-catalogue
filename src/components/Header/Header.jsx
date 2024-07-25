import logo from '/logo.png';
import styles from './Header.module.css';

import { Link } from 'react-router-dom';
import Button from '../Button/Button';

const Header = () => {
  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <Link to="/">
          <img src={logo} className={styles.logo} alt="logo" />
        </Link>

        <div className={styles.right}>
          <Link to="/auth">
            <Button children="Sign in" />
          </Link>

          {/* <Link to="/favorites">
            <img src="/heart.svg" className={styles.heart} alt="favorite-heart" />
          </Link>*/}

          {/*nightMode ? <img src="/day-icon.png" className={styles.themeIcon} alt="night-mode-on" /> : <img src="/night-icon.png" className={styles.themeIcon} alt="night-mode-off" />*/}
        </div>
      </div>
    </section>
  );
};

export default Header;
