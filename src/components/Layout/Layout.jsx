import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logoutThunk } from "../../redux/auth/authSlice";
import DestopNavbar from "../DesktopNavbar/DestopNavbar";
import MobileNavbar from "../MobileNavbar/MobileNavbar";
import useScreenDetector from "../../hooks/useScreenDetector";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDesktop, isTablet, isMobile } = useScreenDetector();
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  const handleLogout = () => dispatch(logoutThunk());
  const handleBackNavigation = () => navigate(-1);

  return (
    <div>
      <header>{(isDesktop || isTablet) && <DestopNavbar />}</header>
      <button onClick={handleBackNavigation}>Ir atrás</button>
      {isAuthenticated && <button onClick={handleLogout}>Cerrar sesión</button>}
      {user?.photoURL && <img src={user?.photoURL} alt={user?.displayName} />}
      Layout
      <Outlet />
      <footer>{isMobile && <MobileNavbar />}</footer>
    </div>
  );
};

export default Layout;
