import React from 'react';

const Login = () => {
  // Cette fonction redirige l'utilisateur vers ton Backend (Port 8000)
  // Grâce au proxy, pas besoin de mettre http://localhost:8000 devant
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/spotify';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Bienvenue sur Spotimate 🎵</h1>
      <p>Connecte-toi pour découvrir tes compatibilités musicales.</p>
      
      <button 
        onClick={handleLogin}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#1DB954', // Vert Spotify
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Se connecter avec Spotify
      </button>
    </div>
  );
};

export default Login;