/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';

import "../src/style/icon/tabler-icons/webfont/tabler-icons.css";
import "../src/style/icon/feather/css/iconfont.css";
import 'aos/dist/aos.css';
import { base_path } from './environment';
import AllRoutes from './feature-module/router/router';
import { Provider } from "react-redux";
import Store from './core/redux/store';
const rootElement = document.getElementById('root');
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
        
        <BrowserRouter basename={base_path}>
          <AllRoutes />
        </BrowserRouter>
        </Provider>
    </React.StrictMode>,
  );
} else {
  console.error("Element with id 'root' not found.");
}
