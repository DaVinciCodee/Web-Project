import React from 'react';
import './Login.css';

const Login = () => {
  // Cette fonction redirige l'utilisateur vers ton Backend (Port 8000)
  // Grâce au proxy, pas besoin de mettre http://localhost:8000 devant
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/spotify';
  };

  return (
    <div className="main">
      <div className="login-container">
        <h1>Caca sur Spotimate 🎵</h1>
        <p>Connecte-toi pour découvrir tes compatibilités musicales.</p>

        <button
          onClick={handleLogin}
          className="login-button"
        >
          Se connecter avec Spotify
        </button>
      </div>
    </div>

  );
};

export default Login;