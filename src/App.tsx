import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename="/">
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;