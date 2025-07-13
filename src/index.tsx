/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { PersistGate } from 'redux-persist/integration/react';
import 'aos/dist/aos.css';
import { base_path } from './environment';
import AllRoutes from './feature-module/router/router';
import { Provider } from "react-redux";
import Store, { persistor } from './core/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { HelmetProvider } from 'react-helmet-async';

const rootElement = document.getElementById('root');


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter basename={base_path}>
              <HelmetProvider>
                <AllRoutes />
              </HelmetProvider>
            </BrowserRouter>
         
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
  );
} else {
  console.error("Element with id 'root' not found.");
}