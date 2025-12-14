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

        <Link to="/notifications" className={`menu-item ${isActive('/notifications')}`}>
          <FiBell className="icon" />
          <span className="label">Notifications</span>
        </Link>

        <Link to="/profile" className={`menu-item ${isActive('/profile')}`}>
          <FiUser className="icon" />
          <span className="label">Profil</span>
        </Link>
      </div>

      {/* 3. Bouton POST */}
      <button className="sidebar-post-btn">Post</button>

      {/* 4. User (Logout) */}
      <div className="sidebar-user" onClick={() => navigate('/')}>
        <div className="user-avatar-placeholder">
          <FiLogOut size={20} color="white" />
        </div>
        <div className="user-info-mini">
          <span className="name">Déconnexion</span>
          {/* <span className="handle">@se_deconnecter</span> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;