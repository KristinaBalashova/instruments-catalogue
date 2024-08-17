import { useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { FaStar } from 'react-icons/fa';

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
