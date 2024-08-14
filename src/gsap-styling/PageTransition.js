import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/router';

export default function PageTransition({ children }) {
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      gsap.fromTo(
        containerRef.current,
        { y: '100%', opacity: 0, borderRadius: '50%' },
        { y: '0%', opacity: 1, borderRadius: '20px', duration: 1, ease: 'power3.out' }
      );
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <div ref={containerRef} className="page-transition">
      {children}
    </div>
  );
}