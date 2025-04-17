import React, { useEffect, useState } from 'react';
import { publicRoutes } from './router.link';
import { Route, Routes } from 'react-router-dom';
import Feature from '../feature';
import CityModal from '../components/CityModal';
import ScrollToTop from '../components/ScrollToTop';

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

  const handleCitySelect = (city: string, branchId: number) => {
    localStorage.setItem('city', city);
    localStorage.setItem('branch_id', branchId.toString());
    setCurrentCity(city);
    setShowCityModal(false);
  
    // Dispatch the city name as a string, not an object
    window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
  };
  
  const handleCloseModal = () => {
    if (currentCity) {
      setShowCityModal(false);
    }
  };

  return (
    <>
    <ScrollToTop/>
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