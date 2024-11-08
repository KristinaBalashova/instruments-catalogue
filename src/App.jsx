import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { UserProvider, ThemeProvider } from './context';

import { ProtectedRoute, ErrorFallback, MainPage, MainLayout } from './components';
import { AuthPage, Favorites, InstrumentCreator, InstrumentPage } from './containers';

const routes = {
  main: '/',
  favorites: '/favorites',
  auth: '/auth',
  instrumentEditor: '/instrument-editor/:id',
  instrumentCreator: '/instrument-creator',
  instrumentPage: '/instrument-page/:id',
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <UserProvider>
          <Router basename={routes.main}>
            <MainLayout>
              <Routes>
                <Route path={routes.main} element={<MainPage />} />
                <Route path={routes.favorites} element={<Favorites />} />
                <Route path={routes.auth} element={<AuthPage />} />
                <Route
                  path={routes.instrumentEditor}
                  element={
                    <ProtectedRoute>
                      <InstrumentPage isEditable={true} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={routes.instrumentCreator}
                  element={
                    <ProtectedRoute>
                      <InstrumentCreator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={routes.instrumentPage}
                  element={<InstrumentPage isEditable={false} />}
                />
              </Routes>
            </MainLayout>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
