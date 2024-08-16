import './App.module.css';
import MainPage from './components/MainPage/MainPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstrumentCreator from './components/InstrumentCreator/InstrumentCreator';
import AuthPage from './components/AuthPage/AuthPage';
import Favorites from './components/Favorites/Favorites';
import InstrumentPage from './components/InstrumentPage/InstrumentPage';
import { UserContext, ThemeContext } from './context/context';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { strings } from './strings';

function App() {
  const [user, setUser] = useState('reader');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let { data, error } = await supabase.from('users').select('role').eq('id', user.id);

        if (error) {
          alert(strings.errors.fetchingError, error);
        } else if (data && data.length > 0) {
          const userRole = data[0].role;
          setUser(userRole);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
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
  );
}

export default App;
