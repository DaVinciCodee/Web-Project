import{ useEffect, useState } from 'react';
import { fetchNowPlaying } from '../../services/api';
import './NowPlaying.css'; // Import du fichier CSS

const NowPlaying = ({ spotifyId }) => {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const loadTrack = async () => {
      const data = await fetchNowPlaying(spotifyId);
      setTrack(data);
    };

    loadTrack();
    
    // Rafraîchissement automatique toutes les 30s
    const interval = setInterval(loadTrack, 30000);
    return () => clearInterval(interval);
  }, [spotifyId]);

  if (!track || !track.isPlaying) return null;

  return (
    <div className="now-playing-card">
      <img 
        src={track.albumImage} 
        alt="Album Cover" 
        className="now-playing-image"
      />
      
      <div className="now-playing-info">
        <span className="now-playing-label">EN ÉCOUTE 🎧</span>
        <span className="now-playing-title">{track.title}</span>
        <span className="now-playing-artist">{track.artist}</span>
      </div>
    </div>
  );
};

export default NowPlaying;