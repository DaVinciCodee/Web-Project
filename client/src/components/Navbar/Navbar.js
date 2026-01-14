import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiBell, FiUser, FiLogOut, FiMessageCircle } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa"; 
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    localStorage.clear();

    navigate('/');

    window.location.reload();
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/feed">
          <FaSpotify className='logo' size={40} color="#1DB954" />
        </Link>
        <Link to="/feed">
          <div>SpotiMate</div>
        </Link>
      </div>

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

      <Link to="/createPost" className='link-post-btn'>
        <button className="sidebar-post-btn">Post</button>
      </Link>


      <div className="sidebar-user" onClick={() => navigate('/')}>
        <div className="user-avatar-placeholder">
          <FiLogOut size={20} color="white" />
        </div>
        <div className="user-info-mini">
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;