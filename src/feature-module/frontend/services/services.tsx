import React from 'react';
import ServicesRoutes from './services.routes';
import HomeHeader from '../home/header/home-header';
import FooterSeven from '../home/home-seven/footer-seven';

const Services = () => {
  return (
    <>
      {/* <HomeHeader type={1} /> */}
      <HomeHeader type={2}/>
      <ServicesRoutes />
      <FooterSeven />
    </>
  );
};

export default Services;
