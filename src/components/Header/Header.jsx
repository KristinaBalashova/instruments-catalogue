import { useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { FaStar } from 'react-icons/fa';
import { BsToggleOff } from 'react-icons/bs';
import { BsToggleOn } from 'react-icons/bs';

import { strings } from '../../strings';
import { ThemeContext } from '../../context/context';

import Button from '../Button/Button';

import logo from '/logo.png';
import styles from './Header.module.css';

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

          <Link to="/favorites">
            <FaStar className={styles.filled} />
          </Link>

          {theme === 'light' ? (
            <BsToggleOff onClick={() => setTheme('light')} className={styles.toggle} />
          ) : (
            <BsToggleOn onClick={() => setTheme('dark')} className={styles.toggleDark} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
