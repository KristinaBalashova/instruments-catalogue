import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { UserContext, ThemeContext } from './context/context';
import { getUserData, getUser } from './api/api';

import { MainPage, Header, Footer } from './components';
import { AuthPage, Favorites, InstrumentCreator, InstrumentPage } from './containers';

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { supabaseUser, userError } = await getUser();

        if (userError) throw userError;

        if (supabaseUser) {
          const { data, error } = await getUserData(id);

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
