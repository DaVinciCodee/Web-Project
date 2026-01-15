import './Login.css';
import Vinyle from './vinyle.png';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'https://spotimate-7eqq.onrender.com/api/auth/spotify';
  };

  return (
    <div className="login-main">
      <div className="login-container">
        <div className='login-title'>Bienvenue sur Spotimate</div>
        <div className='login-text'>Découvrez vos compatibilités musicales.</div>

        <button
          onClick={handleLogin}
          className="login-button"
        >
          Se connecter avec Spotify
        </button>
        <img className='login-img' src={Vinyle} alt="" />
      </div>
    </div>

  );
};

export default Login;