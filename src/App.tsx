import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter basename="/">
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;