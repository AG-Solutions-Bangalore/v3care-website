import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { all_routes } from '../../core/data/routes/all_routes';
import HomeSeven from '../frontend/home/home-seven/home-seven';
import Pages from '../frontend/pages/pages';
import Services from '../frontend/services/services';
import Blog from '../frontend/blog/blog';
import Booking1 from '../frontend/pages/booking/booking-1';
import Error404 from '../frontend/pages/Error page/error404';
import NewHome from '../frontend/home/new-home';
import Error500 from '../frontend/pages/Error page/error500';

const routes = all_routes;

const publicRoutes = [
 // we are working on this 
  {
    path: routes.index,
    name: 'Home',
    element: <HomeSeven />,
    route: Route,
  },


 
  
  
  {
    path: '/',
    name: 'Root',
    element: <Navigate to="/" />,
    route: Route,
  },
  {
    path: '*',
    name: 'NotFound',
    element: <Navigate to="/" />,
    route: Route,
  },

  // pages module's path
  {
    path: routes.booking1,
    name: 'booking-1',
    element: <Booking1 />,
    route: Route,
  },
 
  // {
  //   path: routes.booking2,
  //   name: 'booking-2',
  //   element: <Booking2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.bookingDone,
  //   name: 'booking-done',
  //   element: <BookingDone />,
  //   route: Route,
  // },
  // {
  //   path: routes.bookingPayment,
  //   name: 'booking-payment',
  //   element: <BookingPayment />,
  //   route: Route,
  // },



  // provider module's path

 

  //customer module's path

  // blog module's path
  // service path

  {
    path: routes.pages,
    name: 'pages',
    element: <Pages />,
    route: Route,
  },
  
  {
    path: routes.services,
    name: 'services',
    element: <Services />,
    route: Route,
  },
  {
    path: routes.blog,
    name: 'blog',
    element: <Blog />,
    route: Route,
  },
 
  
 
 
];

export { publicRoutes };
