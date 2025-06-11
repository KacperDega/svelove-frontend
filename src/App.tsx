// src/App.tsx
import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const titleMap: Record<string, string> = {
  '/': 'Strona główna | svelove',
  '/login': 'Logowanie | svelove',
  '/register': 'Rejestracja | svelove',
  '/dashboard': 'Panel użytkownika | svelove',
};

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    document.title = titleMap[location.pathname] || 'svelove';
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
    <TitleUpdater />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
