import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import RecommendationCard from '../../components/RecommendationCard/RecommendationCard';
import GenreBadge from '../../components/GenreBadge/GenreBadge';
import EditProfileModal from '../../components/EditProfile/EditProfile';
import NowPlaying from '../../components/NowPlaying/NowPlaying';
import { fetchUserProfile, updateUserProfile } from '../../services/api';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile on component mount
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

      fetch(`http://localhost:8000/api/users/recommendations?id=${spotifyId}`)
        .then(res => res.json())
        .then(data => {
          setRecommendations(data.slice(0, 4));
        })
        .catch(err => console.error("Erreur chargement recos:", err));
    }
  }, []); 

  // Handle profile save
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

  // Handle follow action
  const handleFollow = async (idToFollow) => {
    try {
        const myId = localStorage.getItem("spotifyId") 

        if (!myId) {
            alert("Erreur: Impossible de vous identifier. Êtes-vous bien connecté ?");
            return;
        }
        if (!idToFollow) {
            console.error("Erreur: ID de l'ami introuvable (undefined)");
            return;
        }
        await axios.put(`https://spotimate-7eqq.onrender.com/api/users/${idToFollow}/follow`, {
            userId: myId
        });
        
        alert("Utilisateur suivi avec succès !");
        
        window.location.reload();

    } catch (err) {
        console.error("Erreur lors du follow :", err);
        alert("Une erreur est survenue lors de l'ajout.");
    }
  };

  if (loading) return <div className="loading-screen">Chargement... 🎵</div>;
  if (!user) return <div className="error-screen">Erreur profil</div>;

  return (
    <div className="profile-container">
      <div className="profile-content">
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
              <span>
                {user.followers ? user.followers.length : 0}
                <span className="stat-label"> Abonnés</span>
              </span>

              <span>
                {user.following ? user.following.length : 0}
                <span className="stat-label"> Abonnements</span>
              </span>
            </div>

            <div className="profile-actions">

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

              <button
                onClick={() => setIsEditing(true)}
                className="edit-profile-btn"
              >
                Modifier le profil
              </button>
            </div>

            <NowPlaying spotifyId={user.spotifyId} />
          </div>
        </div>

        <section className="profile-section">
          <h2 className="section-title">Mes Vibes 🎵</h2>
          <div className="genres-container">
            {user.topGenres && user.topGenres.map((genre, index) => (
              <GenreBadge key={index} label={genre} />
            ))}
          </div>
        </section>

        {recommendations.length > 0 && (
          <section className="profile-section">
            <h2 className="section-title">Profils Similaires 🤝</h2>

            <div className="recommendations-grid">
              {recommendations.map((rec) => (
                <RecommendationCard 
                  key={rec.user.spotifyId} 
                  user={rec.user} 
                  score={rec.displayScore} 
                  details={rec.details}
                  onFollow={() => handleFollow(rec.user._id)} 
                />
              ))}
            </div>
          </section>
        )}

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

        <section className="profile-section">
          <h2 className="section-title">Publications récentes 📝</h2>
          <div className="empty-post-placeholder">
            <p>Aucun post pour le moment...</p>
            <Link to="/createPost">
              <button className="create-post-btn">+ Créer un post</button>
            </Link>
          </div>
        </section>

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