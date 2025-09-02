import cx from 'classnames';
import { useSelector} from 'react-redux';

import { Header } from '../..';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const currentTheme = useSelector((state) => state.theme.value);

  return (
    <div className={cx(styles.root, currentTheme === 'dark' && styles.darkTheme)}>
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
