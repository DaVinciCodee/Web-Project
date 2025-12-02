import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Pour cliquer sur un profil suggéré
import ArtistCard from '../components/ArtistCard';
import GenreBadge from '../components/GenreBadge';
import EditProfileModal from '../components/EditProfile';
import NowPlaying from '../components/NowPlaying';
import { fetchUserProfile, updateUserProfile } from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]); // Nouveau State
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const spotifyId = queryParams.get('id');

    if (spotifyId) {
      setLoading(true);
      
      // 1. Charger le Profil
      fetchUserProfile(spotifyId).then(data => {
        setUser(data);
        setLoading(false);
      });

      // 2. Charger les Recommandations (Similaires à cet ID)
      // On utilise le port 8000 (ou 3000 selon ton serveur)
      fetch(`http://localhost:8000/api/users/recommendations?id=${spotifyId}`)
        .then(res => res.json())
        .then(data => {
          // On garde le Top 4 pour ne pas encombrer
          setRecommendations(data.slice(0, 4));
        })
        .catch(err => console.error("Erreur chargement recos:", err));
    }
  }, []); // Le tableau vide [] assure que ça ne tourne qu'une fois au montage

  const handleSaveProfile = async (formData) => {
    try {
      setUser({ ...user, ...formData });
      setIsEditing(false);
      await updateUserProfile(user.spotifyId, formData);
    } catch (error) {
      console.error("Erreur sauvegarde", error);
      alert("Erreur lors de la sauvegarde !");
    }
  };

  if (loading) return <div className="loading-screen">Chargement... 🎵</div>;
  if (!user) return <div className="error-screen">Erreur profil</div>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        
        {/* --- 1. EN-TÊTE (HEADER) --- */}
        <div className="profile-header">
          <img 
            src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} 
            alt="Profil" 
            className="profile-avatar"
          />

          <div className="profile-info">
            <h1>{user.user_name || user.spotifyId}</h1>
            <p className="profile-bio">{user.bio || "Aucune bio renseignée."}</p>

            <div className="profile-stats">
              <span>{user.followers ? user.followers.length : 0} <span className="stat-label">Abonnés</span></span>
              <span>{user.following ? user.following.length : 0} <span className="stat-label">Abonnements</span></span>
            </div>

            <div className="profile-actions">
              <a href={`https://open.spotify.com/user/${user.spotifyId}`} target="_blank" rel="noreferrer" className="spotify-link-btn">
                 <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png" alt="Spotify" />
              </a>
              <button onClick={() => setIsEditing(true)} className="edit-profile-btn">Modifier le profil</button>
            </div>
            
            <NowPlaying spotifyId={user.spotifyId} />
          </div>
        </div>

        {/* --- 2. VIBES --- */}
        <section className="profile-section">
          <h2 className="section-title">Mes Vibes 🎵</h2>
          <div className="genres-container">
            {user.topGenres && user.topGenres.map((genre, index) => (
              <GenreBadge key={index} label={genre} />
            ))}
          </div>
        </section>

        {/* --- 3. RECOMMANDATIONS (NOUVELLE SECTION) --- */}
        {recommendations.length > 0 && (
          <section className="profile-section">
            <h2 className="section-title">Profils Similaires 🤝</h2>
            <div className="recommendations-grid">
              {recommendations.map((rec, index) => (
                <Link to={`/profile?id=${rec.user.spotifyId}`} key={index} className="reco-card-link">
                  <div className="reco-card">
                    <div className="reco-header">
                      <img 
                        src={rec.user.profilePicture || "https://via.placeholder.com/50"} 
                        alt={rec.user.user_name} 
                        className="reco-avatar"
                      />
                      <span className="reco-score">{rec.displayScore}</span>
                    </div>
                    <div className="reco-info">
                      <h4>{rec.user.user_name}</h4>
                      <small>
                        {parseInt(rec.details.commonTracks) > 0 ? "🎵 Mêmes sons" : 
                         parseInt(rec.details.commonArtists) > 30 ? "🎤 Mêmes artistes" : "🌊 Même Vibe"}
                      </small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* --- 4. TOP ARTISTES --- */}
        <section className="profile-section">
          <h2 className="section-title">Top Artistes 🌟</h2>
          <div className="artists-scroll-container">
            {user.topArtists && user.topArtists.map((artist) => (
              <ArtistCard 
                key={artist.spotifyId} 
                name={artist.name} 
                imageUrl={artist.imageUrl} 
                genres={artist.genres} 
              />
            ))}
          </div>
        </section>

        {/* --- 5. POSTS --- */}
        <section className="profile-section">
          <h2 className="section-title">Publications récentes 📝</h2>
          <div className="empty-post-placeholder">
            <p>Aucun post pour le moment...</p>
            <button className="create-post-btn">+ Créer un post</button>
          </div>
        </section>

        {/* --- MODALE --- */}
        {isEditing && (
          <EditProfileModal 
            user={user} 
            onClose={() => setIsEditing(false)} 
            onSave={handleSaveProfile} 
          />
        )}

      </div>
    </div>
  );
};

export default Profile;