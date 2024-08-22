import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { supabase } from './helpers/supabaseClient';
import { UserContext, ThemeContext } from './context/context';
import { getUserData } from './api/api';

import { MainPage, Header, Footer, ErrorFallback } from './components';
import { AuthPage, Favorites, InstrumentCreator, InstrumentPage } from './containers';

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          const { data, error } = await getUserData(session.user.id);

          if (error) throw error;

          if (data) {
            setUser({
              id: session.user.id,
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

  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      setUser({
        id: session.user.id,
        role: session.user.role,
      });
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
    }
  });

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Router basename="/instruments-catalogue/">
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
