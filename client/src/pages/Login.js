import './Login.css';
import Vinyle from '../img/vinyle.png'

const Login = () => {
  // Cette fonction redirige l'utilisateur vers le Backend (Port 8000)
  // Grâce au proxy, pas besoin de mettre http://localhost:8000 devant
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/spotify';
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