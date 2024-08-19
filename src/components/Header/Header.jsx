import { useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { FaStar } from 'react-icons/fa';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';

import { strings } from '../../strings';
import { ThemeContext } from '../../context/context';

import Button from '../Button/Button';

import logo from '/logo.png';
import styles from './Header.module.css';

const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <Link to="/">
          <img src={logo} className={styles.logo} alt="logo" />
        </Link>

        <div className={styles.right}>
          <Link to="/auth">
            <Button>{strings.signIn}</Button>
          </Link>

          <Link to="/favorites">
            <FaStar className={styles.filled} />
          </Link>

          {theme === 'light' ? (
            <BsToggleOff
              onClick={handleToggleTheme}
              className={styles.toggle}
              aria-label="Switch to dark mode"
            />
          ) : (
            <BsToggleOn
              onClick={handleToggleTheme}
              className={styles.toggleDark}
              aria-label="Switch to light mode"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
