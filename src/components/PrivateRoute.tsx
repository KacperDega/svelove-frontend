import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const clearLocalStorage = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('profilePhotoUrl');
};

const useAuth = () => {
  const token = localStorage.getItem('jwt');

  if (!token) {
    return { isAuthenticated: false };
  }

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      clearLocalStorage();
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true };
  } catch (error) {
    console.error("Błąd podczas dekodowania tokena:", error);
    clearLocalStorage();
    return { isAuthenticated: false };
  }
};

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;