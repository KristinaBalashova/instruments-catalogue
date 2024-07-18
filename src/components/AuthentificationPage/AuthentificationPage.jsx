import { Auth } from '@supabase/auth-ui-react';
import styles from './AuthentificationPage.module.css';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../supabaseClient';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { UserContext } from '../../context/context';
import { useEffect, useContext, useState } from 'react';

const AuthentificationPage = () => {
  const { setUser } = useContext(UserContext);

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (session?.user.app_metadata.role === 'super-admin') {
      setUser('editor');
    }

    console.log(session);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={styles.root}>
      <Header />
      {!session && (
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
      )}
      {session && 'You are logged in'}
      <Footer />
    </div>
  );
};

export default AuthentificationPage;
