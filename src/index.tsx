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
const rootElement = document.getElementById('root');
import {  HelmetProvider } from 'react-helmet-async';
// const location = window.location.pathname;

// useEffect(() => {
//   window.location.pathname.includes("/admin")
//   ? import("./style/admin/css/admin.css")
//   : import("./style/scss/main.scss");
// }, [location])


  

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
       
        <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
       
        <BrowserRouter basename={base_path}>
        <HelmetProvider>
          <AllRoutes />
          </HelmetProvider>
        </BrowserRouter>
     
        </PersistGate>
        </Provider>
      
    </React.StrictMode>,
  );
} else {
  console.error("Element with id 'root' not found.");
}
