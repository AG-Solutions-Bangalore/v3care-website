// SmoothScroll.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';


smoothscroll.polyfill();

interface SmoothScrollProps {
  children?: React.ReactNode;
  scrollToTop?: boolean;
  targetId?: string;
  behavior?: 'smooth' | 'auto';
}

const SmoothScroll = ({
  children = null,
  scrollToTop = true,
  targetId,
  behavior = 'smooth'
}: SmoothScrollProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior,
      });
    } else if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior });
      }
    }
  }, [pathname, scrollToTop, targetId, behavior]);

  return children;
};

export default SmoothScroll;