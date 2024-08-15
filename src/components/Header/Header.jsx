import logo from '/logo.png';
import styles from './Header.module.css';
import { useContext } from 'react';
import { ThemeContext } from '../../context/context';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import cx from 'classnames';
import { strings } from '../../strings';
const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <Link to="/">
          <img src={logo} className={styles.logo} alt="logo" />
        </Link>

        <div className={styles.right}>
          <Link to="/auth">
            <Button children={strings.signIn} />
          </Link>

          {/* <Link to="/favorites">
            <img src="/heart.svg" className={styles.heart} alt="favorite-heart" />
          </Link>*/}

          <span onClick={() => setTheme('light')} className={styles.toggle}>
            light
          </span>
          <span onClick={() => setTheme('dark')} className={styles.toggle}>
            dark
          </span>
        </div>
      </div>
    </section>
  );
};

export default Header;
