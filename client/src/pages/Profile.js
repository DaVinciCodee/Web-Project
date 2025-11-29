import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ArtistCard from '../components/ArtistCard';
import GenreBadge from '../components/GenreBadge';
import { fetchUserProfile } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const spotifyId = queryParams.get('id');

    if (spotifyId) {
      fetchUserProfile(spotifyId).then(data => {
        setUser(data);
        setLoading(false);
      });
    }
  }, []);

  if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Chargement...</div>;
  if (!user) return <div style={{color:'white'}}>Erreur profil</div>;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* --- 1. EN-TÊTE DU PROFIL (HEADER) --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '30px' }}>
          
          {/* Photo de profil ronde */}
          <img 
            src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} 
            alt="Profil" 
            style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '4px solid #1DB954', // Bordure verte Spotify
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }} 
          />

          {/* Infos texte */}
          <div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
              {user.user_name} {/* Idéalement afficher le display_name si tu l'as stocké */}
            </h1>
            
            {/* La BIO */}
            <p style={{ fontSize: '1.1rem', color: '#b3b3b3', lineHeight: '1.5', maxWidth: '500px' }}>
              {user.bio}
            </p>

            {/* Stats rapides (Faux chiffres pour l'instant) */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px', fontWeight: 'bold' }}>
              <span>24 <span style={{fontWeight:'normal', color:'#b3b3b3'}}>Abonnés</span></span>
              <span>12 <span style={{fontWeight:'normal', color:'#b3b3b3'}}>Abonnements</span></span>
            </div>
          </div>
        </div>

        {/* --- 2. LES GOÛTS MUSICAUX --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ borderLeft: '4px solid #1DB954', paddingLeft: '10px' }}>Mes Vibes 🎵</h2>
          <div style={{ marginTop: '15px' }}>
            {user.topGenres.map((genre, index) => <GenreBadge key={index} label={genre} />)}
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ borderLeft: '4px solid #1DB954', paddingLeft: '10px' }}>Top Artistes 🌟</h2>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0' }}>
            {user.topArtists.map((artist) => (
              <ArtistCard key={artist.spotifyId} name={artist.name} imageUrl={artist.imageUrl} genres={artist.genres} />
            ))}
          </div>
        </section>

        {/* --- 3. LES POSTS (Placeholder) --- */}
        <section>
          <h2 style={{ borderLeft: '4px solid #1DB954', paddingLeft: '10px' }}>Publications récentes 📝</h2>
          
          {/* Un exemple de "Post" vide pour montrer à quoi ça ressemblera */}
          <div style={{ 
            backgroundColor: '#181818', 
            padding: '20px', 
            borderRadius: '10px', 
            marginTop: '20px',
            textAlign: 'center',
            color: '#b3b3b3'
          }}>
            <p>Aucun post pour le moment...</p>
            <button style={{
              marginTop: '10px',
              backgroundColor: 'transparent',
              border: '1px solid #1DB954',
              color: '#1DB954',
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer'
            }}>
              + Créer un post
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Profile;