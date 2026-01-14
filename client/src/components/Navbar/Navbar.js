import { Link, useNavigate, useLocation } from 'react-router-dom';
// Import des icônes (bi = Bootstrap Icons, fi = Feather Icons, au choix)
import { FiHome, FiSearch, FiBell, FiUser, FiLogOut, FiMessageCircle } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa"; // Logo Spotify
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Pour savoir quelle page est active

  // Fonction pour vérifier si le lien est actif
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    // 1. On vide TOUTE la mémoire locale
    localStorage.clear();

    // (Alternative : supprimer seulement les clés spécifiques)
    // localStorage.removeItem("mySpotifyId");
    // localStorage.removeItem("myMongoId");
    // localStorage.removeItem("accessToken");

    // 2. On redirige vers l'accueil ou la page de login
    navigate('/');

    // 3. (Optionnel) On recharge la page pour remettre à zéro tous les états React
    window.location.reload();
  };
  return (
    <nav className="navbar">
      {/* 1. Logo */}
      <div className="navbar-logo">
        <Link to="/feed">
          {/* Logo vert Spotify-like */}
          <FaSpotify className='logo' size={40} color="#1DB954" />
        </Link>
        <Link to="/feed">
          <div>SpotiMate</div>
        </Link>
      </div>

      {/* 2. Menu */}
      <div className="sidebar-menu">
        <Link to="/feed" className={`menu-item ${isActive('/feed')}`}>
          <FiHome className="icon" />
          <span className="label">Accueil</span>
        </Link>

        <Link to="/search" className={`menu-item ${isActive('/search')}`}>
          <FiSearch className="icon" />
          <span className="label">Explorer</span>
        </Link>

        <Link to="/messages" className={`menu-item ${isActive('/messages')}`}>
          <FiMessageCircle className="icon" />
          <span className="label">Messages</span>
        </Link>

        <Link to="/profile" className={`menu-item ${isActive('/profile')}`}>
          <FiUser className="icon" />
          <span className="label">Profil</span>
        </Link>
      </div>

      {/* 3. Bouton POST */}
      <Link to="/createPost" className='link-post-btn'>
        <button className="sidebar-post-btn">Post</button>
      </Link>


      {/* 4. User (Logout) */}
      <div className="sidebar-user" onClick={() => navigate('/')}>
        <div className="user-avatar-placeholder">
          <FiLogOut size={20} color="white" />
        </div>
        <div className="user-info-mini">
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
          {/* <span className="handle">@se_deconnecter</span> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;