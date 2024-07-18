import './App.module.css';
import MainPage from './components/MainPage/MainPage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstrumentCreator from './components/InstrumentCreator/InstrumentCreator';
import AuthentificationPage from './components/AuthentificationPage/AuthentificationPage';
import InstrumentEditor from './components/InstrumentEditor/InstrumentEditor';
import Favorites from './components/Favorites/Favorites';
import InstrumentPage from './components/InstrumentPage/InstrumentPage';
import { UserContext } from './context/context';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
function App() {
  const [user, setUser] = useState('reader');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.app_metadata.role === 'super-admin') {
        setUser('editor');
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/instrument-edit" element={<InstrumentEditor />} />
          <Route path="/authentification" element={<AuthentificationPage />} />
          <Route path="/instrument-creator" element={<InstrumentCreator />} />
          <Route path="/instrument-page" element={<InstrumentPage />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
