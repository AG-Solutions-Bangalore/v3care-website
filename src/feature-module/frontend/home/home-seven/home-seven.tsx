import React, { lazy, Suspense } from 'react';
import HomeHeader from '../header/home-header';
import DefaultHelmet from '../../common/helmet/DefaultHelmet';
import './HomeSeven.css';
import HeroSection from './HeroSection';
// Lazy-loaded components
const PopularService = lazy(() => import('./PopularService'));
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const BlogSection = lazy(() => import('./BlogSection'));
const ClientsSection = lazy(() => import('./ClientsSection'));

// Skeleton loader component
const SkeletonLoader: React.FC<{ variant: 'services' | 'testimonials' | 'blog' | 'clients' }> = ({ variant }) => {
  const heights = {
    services: '350px',
    testimonials: '250px',
    blog: '400px',
    clients: '200px'
  };

  return (
    <div 
      className="skeleton-loader" 
      style={{ height: heights[variant] }}
      aria-label={`Loading ${variant} section`}
    >
      <div className="shimmer-effect" />
    </div>
  );
};

const HomeSeven: React.FC = () => {
  return (
    <>
      <DefaultHelmet />
      <HomeHeader />
      
      <main className="home-seven-wrapper">
        {/* Hero Section - Not lazy loaded as it's above the fold */}
        <HeroSection />

        {/* Popular Service */}
        <section aria-labelledby="popular-service-heading">
          <Suspense fallback={<SkeletonLoader variant="services" />}>
            <PopularService />
          </Suspense>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="testimonials-heading">
          <Suspense fallback={<SkeletonLoader variant="testimonials" />}>
            <TestimonialsSection />
          </Suspense>
        </section>

        {/* Blog Section */}
        <section aria-labelledby="blog-heading">
          <Suspense fallback={<SkeletonLoader variant="blog" />}>
            <BlogSection />
          </Suspense>
        </section>

        {/* Clients Section */}
        <section aria-labelledby="clients-heading">
          <Suspense fallback={<SkeletonLoader variant="clients" />}>
            <ClientsSection />
          </Suspense>
        </section>
      </main>
    </>
  );
};

export default HomeSeven;