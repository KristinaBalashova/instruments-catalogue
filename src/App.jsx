import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './store';

import { UserProvider } from './context';

import { ProtectedRoute, ErrorFallback, MainPage } from './components';
import { MainLayout } from './components/layouts';
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
      <Provider store={store}>
        <UserProvider>
          <Router basename={routes.main}>
            <Toaster position="bottom-right" reverseOrder={false} />
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
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
