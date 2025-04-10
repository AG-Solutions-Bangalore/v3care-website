
import React, { useEffect, useState } from 'react';
import { publicRoutes } from './router.link';
import { Route, Routes } from 'react-router-dom';
import Feature from '../feature';
import CityModal from '../components/CityModal';

const AllRoutes = () => {
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  
  useEffect(() => {
    const city = localStorage.getItem('city');
    setCurrentCity(city);
    if (!city) {
      setShowCityModal(true);
    }
  }, []);

  // const handleCitySelect = (city: string) => {
  //   localStorage.setItem('city', city);
  //   setCurrentCity(city);
  //   setShowCityModal(false);
  // };
  const handleCitySelect = (city: string) => {
    localStorage.setItem('city', city);
    setCurrentCity(city);
    setShowCityModal(false);
  
    // Dispatch a custom event to notify others
    window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
  };
  
  const handleCloseModal = () => {
    // Only allow closing if a city is already selected
    if (currentCity) {
      setShowCityModal(false);
    }
  };

  return (
    <>
      {showCityModal && (
        <CityModal 
          onSelectCity={handleCitySelect} 
          onClose={currentCity ? handleCloseModal : undefined}
          selectedCity={currentCity}
        />
      )}
      <Routes>
        <Route element={<Feature />}>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default AllRoutes;