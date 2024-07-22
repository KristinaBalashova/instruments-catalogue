import logo from '/logo.png';
import styles from './Header.module.css';
import HeartSymbol from '../HeartSymbol/HeartSymbol';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/context';
import { useContext } from 'react';
import Button from '../Button/Button';

const Header = ({ nightMode }) => {
  const { user } = useContext(UserContext);

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <Link to="/">
          <img src={logo} className={styles.logo} alt="logo" />
        </Link>

        <div className={styles.right}>
          {user === 'admin' && (
            <Link to="/instrument-creator">
              <Button>Add new instrument</Button>
            </Link>
          )}

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
