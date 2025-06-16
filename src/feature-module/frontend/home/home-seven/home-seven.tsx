import React, { useEffect, useState, lazy, Suspense } from 'react';
import HomeHeader from '../header/home-header';
import './HomeSeven.css'


import HeroSection from './HeroSection';
import DefaultHelmet from '../../common/helmet/DefaultHelmet';
import HomeBanner from './HomeBanner';


const FeaturedCategories = lazy(() => import('./FeaturedCategories'));
const PopularService = lazy(() => import('./PopularService'));
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const BlogSection = lazy(() => import('./BlogSection'));
const ClientsSection = lazy(() => import('./ClientsSection'));

type ComponentLoadState = {
  featuredCategories: boolean;
  popularService: boolean;
  testimonials: boolean;
  blog: boolean;
  clients: boolean;
};

const HomeSeven: React.FC = () => {
  const [loadedComponents, setLoadedComponents] = useState<ComponentLoadState>({
    featuredCategories: false,
    popularService: false,
    testimonials: false,
    blog: false,
    clients: false,
  });

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '200px 0px',
      threshold: 0.01
    };

    const loadComponent = (componentName: keyof ComponentLoadState) => {
      if (!loadedComponents[componentName]) {
        setLoadedComponents(prev => ({ ...prev, [componentName]: true }));
      }
    };

    const observers: Record<string, IntersectionObserver> = {};

    (Object.keys(loadedComponents) as Array<keyof ComponentLoadState>).forEach(component => {
      const target = document.getElementById(`trigger-${component}`);
      if (target) {
        observers[component] = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadComponent(component);
              observers[component].unobserve(entry.target);
            }
          });
        }, observerOptions);

        observers[component].observe(target);
      }
    });

    return () => {
      Object.values(observers).forEach(observer => {
        if (observer && observer.disconnect) {
          observer.disconnect();
        }
      });
    };
  }, [loadedComponents]);

  return (
    <>
    <DefaultHelmet/>
      <HomeHeader />
      <div className="home-seven-wrapper">
        <HeroSection />

        {/* Featured Categories */}
        {/* <section>
          <div id="trigger-featuredCategories" className="trigger-point" />
          <Suspense fallback={<div className="skeleton-loader skeleton-categories" />}>
            {loadedComponents.featuredCategories && <FeaturedCategories />}
          </Suspense>
        </section> */}

        {/* Popular Service */}
        <section>
          <div id="trigger-popularService" className="trigger-point" />
          <Suspense fallback={<div className="skeleton-loader skeleton-services" />}>
            {loadedComponents.popularService && <PopularService />}
          </Suspense>
        </section>

        {/* Banner Section */}

       {/* <HomeBanner/> */}
       
        {/* Testimonials */}
        <section>
          <div id="trigger-testimonials" className="trigger-point" />
          <Suspense fallback={<div className="skeleton-loader skeleton-testimonials" />}>
            {loadedComponents.testimonials && <TestimonialsSection />}
          </Suspense>
        </section>

        {/* Blog Section */}
        <section>
          <div id="trigger-blog" className="trigger-point" />
          <Suspense fallback={<div className="skeleton-loader skeleton-blog" />}>
            {loadedComponents.blog && <BlogSection />}
          </Suspense>
        </section>

        {/* Clients Section */}
        <section>
          <div id="trigger-clients" className="trigger-point" />
          <Suspense fallback={<div className="skeleton-loader skeleton-clients" />}>
            {loadedComponents.clients && <ClientsSection />}
          </Suspense>
        </section>
      </div>

     
    </>
  );
};

export default HomeSeven;