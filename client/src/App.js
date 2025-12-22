import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

import Messenger from './pages/Messenger';
import './App.css';

function App() {
  const isLoginPage = window.location.pathname === '/';

  return (
    <BrowserRouter>
      <div className="app-layout">

        {/* Colonne Gauche : Sidebar */}
        <div className='left-sidebar'>
          <SidebarWrapper />
        </div>

        {/* Colonne Milieu : Feed/Contenu */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messenger />} />
          </Routes>
        </div>

        <div className="right-sidebar">
        </div>

      </div>
    </BrowserRouter>
  );
}

const SidebarWrapper = () => {
  return window.location.pathname !== '/' ? <Navbar /> : null;
}

export default App;