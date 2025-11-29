import React from 'react';
import { Link } from 'react-router-dom'; // Pour naviguer sans recharger la page
import './Navbar.css'; // On importe le style qu'on vient de créer

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>🎧</span> Spotimate
      </div>

      {/* Partie Droite : Le bouton Déconnexion */}
      {/* On redirige vers l'accueil (Login) */}
      <Link to="/" className="navbar-logout">
        Déconnexion
      </Link>
    </nav>
  );
};

export default Navbar;