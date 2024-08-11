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

import { jwtDecode } from 'jwt-decode';

function App() {
  const [user, setUser] = useState('reader');
  const [theme, setTheme] = useState('light');

  /*
  async function getToken() {
    const { subscription: authListener } = supabase.auth.onAuthStateChange(
      async (session) => {
        if (session) {
          const jwt = jwtDecode(session.access_token);
          const userRole = jwt.app_metadata.userrole.role;
          setUser(userRole);
        }
      },
    );
  }

  getToken();
*/
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
