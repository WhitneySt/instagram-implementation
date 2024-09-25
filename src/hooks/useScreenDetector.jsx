import { useEffect, useMemo, useState } from "react";

//Definir las constantes para los breakpoints

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const useScreenDetector = () => {
  //Definir un estado con useState para guardar el ancho actual de la pantalla
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowSizeChange = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const screenType = useMemo(() => {
    if (width <= MOBILE_BREAKPOINT) return "mobile";
    if (width <= TABLET_BREAKPOINT) return "tablet";
    return "desktop";
  }, [width]);

  return {
    isMobile: screenType === "mobile",
    isTablet: screenType === "tablet",
    isDesktop: screenType === "desktop",
    screenType,
  };
};

export default useScreenDetector;
