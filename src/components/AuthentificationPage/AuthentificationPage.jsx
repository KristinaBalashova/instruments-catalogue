import { Auth } from '@supabase/auth-ui-react';
import styles from './AuthentificationPage.module.css';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../supabaseClient';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const AuthentificationPage = () => {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.container}>
        <div className={styles.auth}>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2B2B2B',
                    brandAccent: '#D4AF37',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthentificationPage;
