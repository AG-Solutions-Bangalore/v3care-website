import React, { lazy, Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { all_routes } from '../../core/data/routes/all_routes';
import HomeSeven from '../frontend/home/home-seven/home-seven';


const AboutUs = lazy(() => import('../frontend/pages/about-us/about-us'));
const Client = lazy(() => import('../frontend/pages/client/client'));
const ServiceGrid = lazy(() => import('../frontend/pages/service-grid/service-grid'));
const BlogGrid = lazy(() => import('../frontend/pages/blog-grid/blog-grid'));
const ContactUs = lazy(() => import('../frontend/pages/contact-us/contact-us'));
const ServiceRequest = lazy(() => import('../frontend/pages/service-request/serviceRequest'));
const BlogDetails = lazy(() => import('../frontend/pages/blog-details/blog-details'));
const Categories = lazy(() => import('../frontend/pages/categories/categories'));


import PaymentSuccess from '../frontend/pages/payment-success/payment-success';
import BookingFailed from '../frontend/pages/payment-success/booking-failed';
import Cart from '../frontend/pages/cart/Cart';
import ServiceDetails1 from '../frontend/pages/service-details/service-details1';
import HomeHeader from '../frontend/home/header/home-header';



const SuspenseLoader = () => (
  <>
  <HomeHeader/>
  {/* <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(240, 248, 255, 0.8)'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #e0f2fe',
      borderTopColor: '#38bdf8',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }}></div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div> */}
<div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            
          </div>
        </div>
  </>
);

const routes = all_routes;

const publicRoutes = [

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
  
  // pages routes 
  {
    path: routes.client,
    name: 'client',
    element: <Suspense fallback={<SuspenseLoader />}><Client /></Suspense>,
    route: Route,
  },
  {
    path: routes.cart,
    name: 'cart',
    element: <Cart />,
    route: Route,
  },
 
  {
    path: routes.aboutUs,
    name: 'about-us',
    element: <Suspense fallback={<SuspenseLoader />}><AboutUs /></Suspense>,
    route: Route,
  },
  {
    path: routes.serviceGrid,
    name: 'ServiceGrid',
    element: <Suspense fallback={<SuspenseLoader />}><ServiceGrid /></Suspense>,
    route: Route,
  },

  {
    path: routes.blogGrid,
    name: 'blogGrid',
    element: <Suspense fallback={<SuspenseLoader />}><BlogGrid /></Suspense>,
    route: Route,
  },

  {
    path: routes.contactUs,
    name: 'contact-us',
    element: <Suspense fallback={<SuspenseLoader />}><ContactUs /></Suspense>,
    route: Route,
  },
  {
    path: routes.serviceRequest,
    name: 'service-request',
    element: <Suspense fallback={<SuspenseLoader />}><ServiceRequest /></Suspense>,
    route: Route,
  },
    // service_id : state?.service_id 
    // service_sub_id : state?.service_sub_id
  {
    path: '/service-details/:category_name/:id/:service_name/:service_id',
    name: 'service-details',
    element: <ServiceDetails1 />,
    route: Route,
  },
  
  {
    path: '/service-details/:category_name/:id/:service_name/:service_id/:service_sub_name/:service_sub_id',
    name: 'service-details-sub',
    element: <ServiceDetails1 />,
    route: Route,
  },


  // homepage go to service details 

  {
    path: '/service-details/:service_name/:service_id',
    name: 'service-details',
    element: <ServiceDetails1 />,
    route: Route,
  },
  {
    path: '/service-details/:service_name/:service_id/:service_sub_name/:service_sub_id',
    name: 'service-details-sub',
    element: <ServiceDetails1 />,
    route: Route,
  },


  {
    path: '/blog-details/:id',
    name: 'blogDetails',
    element: <Suspense fallback={<SuspenseLoader />}><BlogDetails /></Suspense>,
    route: Route,
  },

  {
    path: '/categories/:category_name/:id',
    name: 'categories',
    element: <Suspense fallback={<SuspenseLoader />}><Categories /></Suspense>,
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
];

export { publicRoutes };