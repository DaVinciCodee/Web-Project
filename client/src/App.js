import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Explore from './pages/Explore'

import SideBarRight from './components/SideBarRight';
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
            <Route path="/search" element={<Explore />} />
          </Routes>
        </div>

        {/* AJOUT : Colonne Droite (Contrepoids) */}
        {/* Même si elle est vide pour l'instant, elle force le Feed à rester au milieu */}
        {/* <div className="right-sidebar">
          <SideBarRight />
        </div> */}

      </div>
    </BrowserRouter>
  );
}

const SidebarWrapper = () => {
  return window.location.pathname !== '/' ? <Navbar /> : null;
}

export default App;