import { useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { FaStar } from 'react-icons/fa';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';

import { USER_MESSAGES, THEME_DARK, THEME_LIGHT } from '../../strings';
import { ThemeContext } from '../../context';

import { Button } from '../';

import logo from '/logo.png';
import styles from './Header.module.css';

const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleToggleTheme = () => {
    setTheme(theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT);
  };

  return (
    <section className={cx(styles.root, theme === THEME_DARK && styles.darkTheme)}>
      <div className={styles.container}>
        <Link to="/">
          <img src={logo} className={styles.logo} alt="logo" />
        </Link>

        <div className={styles.right}>
          <Link to="/auth">
            <Button>{USER_MESSAGES.SIGN_IN}</Button>
          </Link>

          <Link to="/favorites">
            <FaStar className={styles.filled} />
          </Link>

          {theme === THEME_LIGHT ? (
            <BsToggleOff
              onClick={handleToggleTheme}
              className={styles.toggle}
              aria-label={USER_MESSAGES.SWITCH_DARK}
            />
          ) : (
            <BsToggleOn
              onClick={handleToggleTheme}
              className={styles.toggleDark}
              aria-label={USER_MESSAGES.SWITCH_LIGHT}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
