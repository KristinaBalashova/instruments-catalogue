import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';

import { USER_MESSAGES, THEME_LIGHT } from '../../strings';

import { SectionLayout } from '../layouts';
import { Button } from '../ui';

import logo from '/logo.png';
import styles from './Header.module.css';

const Header = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.value);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

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

          {currentTheme === THEME_LIGHT ? (
            <BsToggleOff
              onClick={handleThemeToggle}
              className={styles.toggle}
              aria-label={USER_MESSAGES.SWITCH_DARK}
            />
          ) : (
            <BsToggleOn
              onClick={handleThemeToggle}
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
