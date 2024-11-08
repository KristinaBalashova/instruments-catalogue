import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';

import { USER_MESSAGES, THEME_LIGHT } from '../../strings';
import { ThemeContext } from '../../context';

import { Button, SectionLayout } from '../';

import logo from '/logo.png';
import styles from './Header.module.css';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <SectionLayout>
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
              onClick={toggleTheme}
              className={styles.toggle}
              aria-label={USER_MESSAGES.SWITCH_DARK}
            />
          ) : (
            <BsToggleOn
              onClick={toggleTheme}
              className={styles.toggleDark}
              aria-label={USER_MESSAGES.SWITCH_LIGHT}
            />
          )}
        </div>
      </div>
    </SectionLayout>
  );
};

export default Header;
