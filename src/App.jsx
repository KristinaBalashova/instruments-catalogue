import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { UserProvider, ThemeProvider } from './context';

import { Header, ProtectedRoute, ErrorFallback, MainPage } from './components';
import { AuthPage, Favorites, InstrumentCreator, InstrumentPage } from './containers';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <UserProvider>
          <Router basename="/">
            <Header />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/instrument-editor/:id"
                element={
                  <ProtectedRoute>
                    <InstrumentPage isEditable={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instrument-creator"
                element={
                  <ProtectedRoute>
                    <InstrumentCreator />
                  </ProtectedRoute>
                }
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
