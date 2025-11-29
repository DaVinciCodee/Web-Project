import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile'; // On va le créer juste après

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Route d'accueil : Le Login */}
          <Route path="/" element={<Login />} />
          
          {/* Route Profil : Là où on atterrit après Spotify */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;