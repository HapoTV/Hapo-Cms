// src/App.tsx

import {useEffect} from 'react'; // --> ADD: Import useEffect
import {BrowserRouter} from 'react-router-dom';
import {AppRoutes} from './routes/appRoutes.tsx';
import {HelmetProvider} from 'react-helmet-async';
import {ErrorBoundary} from './components/ErrorBoundary';
import {useAuthStore} from './store/auth/auth.store'; // --> ADD: Import your store

function App() {
  // --> ADD: Get the checkAuthStatus function from your store
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
    //-- deploy loading paused const [deployComplete, setDeployComplete] = useState(false);

  // --> ADD: Use the useEffect hook to call the function once on app load
  useEffect(() => {
    console.log("App component has mounted. Running checkAuthStatus...");
    checkAuthStatus();
  }, [checkAuthStatus]); // The dependency array ensures this runs only once


    // The rest of your component remains the same
  return (
    <ErrorBoundary>
      <HelmetProvider>
          <BrowserRouter
              basename="/"
              future={{
                  v7_relativeSplatPath: true,
                  v7_startTransition: true,
              }}
          >
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;