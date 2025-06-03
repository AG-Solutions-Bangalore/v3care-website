// import React from 'react';
// import PagesRoutes from './pages.routes';
// import { useLocation } from 'react-router-dom';
// import DemoUserHeader from './common/demo-user-header';
// import BookingFooter from './common/booking-footer';
// import HomeHeader from '../home/header/home-header';
// import FooterSeven from '../home/home-seven/footer-seven';

// const Pages = () => {
//   const location = useLocation();
//   console.log('location2', location);
//   return (
//     <>
    
//       {location?.pathname == '/pages/booking'?
//        (
//         <DemoUserHeader />
//       ) : (location?.pathname == '/pages/coming-soon' ||
//       location?.pathname == '/pages/installer'  ||
//       location?.pathname == '/pages/installer-new' ||
//       location?.pathname == '/pages/session-expired' ||
//       location?.pathname == '/pages/maintenance') ? (
//         <></>
//       ):<HomeHeader />}
//       <PagesRoutes />
//       {location?.pathname == '/pages/coming-soon' ||
//       location?.pathname == '/pages/installer'  ||
//       location?.pathname == '/pages/installer-new' ||
//       location?.pathname == '/pages/session-expired' ||
//       location?.pathname == '/pages/maintenance' ?

//       (
//         <></>
//       ) :location?.pathname == '/pages/booking' ? 
//       (
//         <BookingFooter/>
//       )
//       : (
//       <FooterSeven />

//       )}
      
//     </>
//   );
// };

// export default Pages;
