import React, { useEffect, useState } from 'react';
import ArtistCard from '../components/ArtistCard';
import GenreBadge from '../components/GenreBadge';
import EditProfileModal from '../components/EditProfile';
import NowPlaying from '../components/NowPlaying'; // Import du widget musique
import { fetchUserProfile, updateUserProfile } from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const spotifyId =
      new URLSearchParams(window.location.search).get("id")
      || localStorage.getItem("spotifyId");

    if (spotifyId) {
      localStorage.setItem("spotifyId", spotifyId);
      fetchUserProfile(spotifyId).then(data => {
        setUser(data);
        setLoading(false);
      });
    }
  }, []);

  const handleSaveProfile = async (formData) => {
    try {
      // Mise à jour optimiste de l'UI
      setUser({ ...user, ...formData });
      setIsEditing(false);
      // Envoi au backend
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

            <p className="profile-bio">
              {user.bio || "Aucune bio renseignée."}
            </p>

            <div className="profile-stats">
              {/* On utilise le '?' pour éviter le crash si la liste est undefined au début */}
              <span>
                {user.followers ? user.followers.length : 0}
                <span className="stat-label"> Abonnés</span>
              </span>

              <span>
                {user.following ? user.following.length : 0}
                <span className="stat-label"> Abonnements</span>
              </span>
            </div>

            {/* --- BOUTONS D'ACTION --- */}
            <div className="profile-actions">

              {/* Lien vers le vrai Spotify */}
              <a
                href={`https://open.spotify.com/user/${user.spotifyId}`}
                target="_blank"
                rel="noreferrer"
                className="spotify-link-btn"
                title="Voir sur Spotify"
              >
                <img
                  src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
                  alt="Spotify"
                />
              </a>

              {/* Bouton Modifier */}
              <button
                onClick={() => setIsEditing(true)}
                className="edit-profile-btn"
              >
                Modifier le profil
              </button>
            </div>

            {/* Widget Musique en cours (Intégré dans le header ou juste dessous) */}
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

        {/* --- 3. TOP ARTISTES --- */}
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

        {/* --- 4. POSTS (Placeholder) --- */}
        <section className="profile-section">
          <h2 className="section-title">Publications récentes 📝</h2>
          <div className="empty-post-placeholder">
            <p>Aucun post pour le moment...</p>
            <button className="create-post-btn">
              + Créer un post
            </button>
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