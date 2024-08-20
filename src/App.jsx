import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { strings } from './strings';
import { supabase } from './helpers/supabaseClient';
import { UserContext, ThemeContext } from './context/context';

import MainPage from './components/MainPage/MainPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InstrumentCreator from './containers/InstrumentCreator/InstrumentCreator';
import AuthPage from './containers/AuthPage/AuthPage';
import Favorites from './containers/Favorites/Favorites';
import InstrumentPage from './containers/InstrumentPage/InstrumentPage';

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user: supabaseUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (supabaseUser) {
          const { data, error } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', supabaseUser.id)
            .single();

          if (error) throw error;

          if (data) {
            setUser({
              id: supabaseUser.id,
              role: data.role,
            });
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Router basename='/instruments-catalogue/'>
            <Header />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/instrument-editor/:id" element={<InstrumentPage isEditable={true} />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/instrument-creator" element={<InstrumentCreator />} />
              <Route path="/instrument-page/:id" element={<InstrumentPage isEditable={false} />} />
            </Routes>
            <Footer />
          </Router>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
