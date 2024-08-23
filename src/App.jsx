import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { UserProvider, ThemeProvider } from './context/context';

import { Header, ProtectedRoute, ErrorFallback } from './components';
import { AuthPage, Favorites, InstrumentCreator, InstrumentPage, MainPage } from './containers';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <UserProvider>
          <Router basename="/instruments-catalogue/">
            <Header />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/instrument-editor/:id"
                element={<ProtectedRoute element={<InstrumentPage isEditable={true} />} />}
              />
              <Route
                path="/instrument-creator"
                element={<ProtectedRoute element={<InstrumentCreator />} />}
              />
              <Route path="/instrument-page/:id" element={<InstrumentPage isEditable={false} />} />
            </Routes>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
