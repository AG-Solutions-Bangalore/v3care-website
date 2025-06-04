import React from 'react';
import { Outlet } from 'react-router';
import '../style/scss/main.scss';

import Cursor from './frontend/common/cursor/cursor';

const Feature = () => {
 
  return (
    <div>
      <div>
        <Outlet />
      </div>

      {/* {location.pathname.includes('admin') ? <></> : <Cursor />} */}
    </div>
  );
};

export default Feature;
