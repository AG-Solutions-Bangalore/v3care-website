import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { all_routes } from '../../core/data/routes/all_routes';
import HomeSeven from '../frontend/home/home-seven/home-seven';
import Booking1 from '../frontend/pages/booking/booking-1';

import AboutUs from '../frontend/pages/about-us/about-us';
import Client from '../frontend/pages/client/client';
import ServiceGrid from '../frontend/pages/service-grid/service-grid';
import BlogGrid from '../frontend/pages/blog-grid/blog-grid';
import ContactUs from '../frontend/pages/contact-us/contact-us';
import ServiceRequest from '../frontend/pages/service-request/serviceRequest';
import ServiceDetails1 from '../frontend/pages/service-details/service-details1';
import BlogDetails from '../frontend/pages/blog-details/blog-details';
import Categories from '../frontend/pages/categories/categories';
import CommingSoon from '../frontend/pages/comming-soon/comming-soon';
import Faq from '../frontend/pages/faq/faq';
import Howitworks from '../frontend/pages/how-it-works/how-it-works';
import TermsCondition from '../frontend/pages/terms-condition/terms-condition';
import Installer from '../frontend/pages/installer/installer';
import Maintenance from '../frontend/pages/maintenance/maintenance';
import Pricing from '../frontend/pages/pricing/pricing';
import PrivacyPolicy from '../frontend/pages/privacy-policy/privacy-policy';
import BookingWizard from '../frontend/pages/booking/booking-wizard';
import BookingDetails from '../frontend/pages/booking/booking-details';
import SessionExpired from '../frontend/pages/session-expired/session-expired';
import PaymentSuccess from '../frontend/pages/payment-success/payment-success';
import BookingFailed from '../frontend/pages/payment-success/booking-failed';


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
 
 
  // pages routes 

  {
    path: routes.client,
    name: 'client',
    element: <Client />,
    route: Route,
  },
 
  {
    path: routes.aboutUs,
    name: 'about-us',
    element: <AboutUs />,
    route: Route,
  },
  {
    path: routes.serviceGrid,
    name: 'ServiceGrid',
    element: <ServiceGrid />,
    route: Route,
  },

  {
    path: routes.blogGrid,
    name: ' blogGrid',
    element: <BlogGrid />,
    route: Route,
  },

  {
    path: routes.contactUs,
    name: 'contact-us',
    element: <ContactUs />,
    route: Route,
  },
  {
    path: routes.serviceRequest,
    name: 'service-request',
    element: <ServiceRequest />,
    route: Route,
  },

  {
    path: routes.serviceDetails1,
    name: 'service-details-1',
    element: <ServiceDetails1 />,
    route: Route,
  },

  {
    path: '/blog-details/:id',
    name: 'blogDetails',
    element: <BlogDetails />,
    route: Route,
  },

  {
    path: '/categories/:id',
    name: 'categories',
    element: <Categories />,
    route: Route,
  },

  {
    path: routes.comingSoon,
    name: 'coming-soon',
    element: <CommingSoon />,
    route: Route,
  },
  {
    path: routes.paymentSuccess,
    name: 'payment-success',
    element: <PaymentSuccess />,
    route: Route,
  },



  {
    path: routes.bookingFailed,
    name: 'booking-failed',
    element: <BookingFailed />,
    route: Route,
  },


  {
    path: routes.faq,
    name: 'faq',
    element: <Faq />,
    route: Route,
  },
  {
    path: routes.howItWorks,
    name: 'how-it-works',
    element: <Howitworks />,
    route: Route,
  },


  {
    path: routes.termsCondition,
    name: 'terms-condition',
    element: <TermsCondition />,
    route: Route,
  },
  {
    path: routes.installer,
    name: 'installer',
    element: <Installer />,
    route: Route,
  },
  
  {
    path: routes.maintenance,
    name: 'maintenance',
    element: <Maintenance />,
    route: Route,
  },
  {
    path: routes.pricingPlan,
    name: 'pricing',
    element: <Pricing />,
    route: Route,
  },
  {
    path: routes.privacyPolicy,
    name: 'privacy-policy',
    element: <PrivacyPolicy />,
    route: Route,
  },
  {
    path: routes.bookings,
    name: 'booking',
    element: <BookingWizard />,
    route: Route,
  },
  {
    path: routes.booking1,
    name: 'booking-1 ',
    element: <Booking1 />,
    route: Route,
  },
  {
    path: routes.bookingDetails,
    name: 'booking-details',
    element: <BookingDetails />,
    route: Route,
  },
  {
    path: routes.sessionExpired,
    name: 'SessionExpired',
    element: <SessionExpired />,
    route: Route,
  },

  






];

export { publicRoutes };
