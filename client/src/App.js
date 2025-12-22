<<<<<<< HEAD
import React, { useEffect } from 'react';
import io from 'socket.io-client';
=======
>>>>>>> 3a003f2d5fa83a89d7e166335e8ed53184bc2102
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
<<<<<<< HEAD

import Messenger from './pages/Messenger';
=======
import Explore from './pages/Explore'
import SideBarRight from './components/SideBarRight';
>>>>>>> 3a003f2d5fa83a89d7e166335e8ed53184bc2102
import './App.css';

function App() {
  const isLoginPage = window.location.pathname === '/';

  return (
    <BrowserRouter>
      <div className="app-layout">

        {/* Colonne Gauche : Sidebar */}
        {!isLoginPage && (
          <div className="left-sidebar">
            <Navbar />
          </div>
        )}


        {/* Colonne Milieu : Feed/Contenu */}
        <div className="main-content" style={{
          width: isLoginPage ? "100vw" : "var(--main-content-width)",
        }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
<<<<<<< HEAD
            <Route path="/messages" element={<Messenger />} />
          </Routes>
        </div>

        <div className="right-sidebar">
        </div>
=======
            <Route path="/search" element={<Explore />} />
          </Routes>
        </div>

        {/* AJOUT : Colonne Droite (Contrepoids) */}
        {/* Même si elle est vide pour l'instant, elle force le Feed à rester au milieu */}
        {/* <div className="right-sidebar">
          <SideBarRight />
        </div> */}
>>>>>>> 3a003f2d5fa83a89d7e166335e8ed53184bc2102

      </div>
    </BrowserRouter>
  );
}

// const SidebarWrapper = () => {
//   return window.location.pathname !== '/' ? <Navbar /> : null;
// }

export default App;