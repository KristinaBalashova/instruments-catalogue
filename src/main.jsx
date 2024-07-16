import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import InstrumentCreator from './components/InstrumentCreator/InstrumentCreator';
import AuthentificationPage from './components/AuthentificationPage/AuthentificationPage';
import InstrumentEditor from './components/InstrumentEditor/InstrumentEditor';
import Favorites from './components/Favorites/Favorites';
import InstrumentPage from './components/InstrumentPage/InstrumentPage';

const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/instrument-edit" element={<InstrumentEditor />} />
      <Route path="/authentification" element={<AuthentificationPage />} />
      <Route path="/instrument-creator" element={<InstrumentCreator />} />
      <Route path="/instrument-page" element={<InstrumentPage />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
