import { useCallback, useEffect, useState } from "react";

export function useSidebar() {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const openMobile = useCallback(() => setIsOpenMobile(true), []);
  const closeMobile = useCallback(() => setIsOpenMobile(false), []);
  const toggleMobile = useCallback(() => setIsOpenMobile((prev) => !prev), []);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart === null) return;
      const currentTouch = e.targetTouches[0].clientX;
      const diff = touchStart - currentTouch;

      // Swipe a la derecha (abrir)
      if (diff < -50 && touchStart < 40) {
        openMobile();
      }

      // Swipe a la izquierda (cerrar)
      if (diff > 50 && isOpenMobile) {
        closeMobile();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [touchStart, isOpenMobile, openMobile, closeMobile]);

  return {
    isOpenMobile,
    toggleMobile,
    closeMobile,
    openMobile,
  };
}
