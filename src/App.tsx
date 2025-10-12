// src/App.tsx
import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import ProfilePage from './pages/Profile'
import EditProfile from './pages/EditProfile'
import EditPhotos from './pages/EditPhotos';
import Matches from './pages/Matches';
import UserStats from './pages/UserStats';

const titleMap: Record<string, string> = {
  '/': 'Witamy! | svelove',
  '/login': 'Logowanie | svelove',
  '/register': 'Rejestracja | svelove',
  '/dashboard': 'Strona główna | svelove',
  '/chat': 'Czat | svelove',
  '/profile': "Profil | svelove",
  '/profile/edit': "Edytuj profil | svelove",
  '/profile/edit/photos': "Edytuj zdjęcia | svelove",
  '/matches': "Dopasowania | svelove",
  '/profile/stats': "Statystyki | svelove",
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
        <Route path="/chat/:matchId?" element={<Chat />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/edit/photos" element={<EditPhotos />} />
        <Route path='/matches' element={<Matches/>} />
        <Route path="/profile/stats" element={<UserStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
