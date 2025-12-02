import React from 'react';

const GenreBadge = ({ label }) => {
  // Une fonction pour générer une couleur aléatoire "pastel" basée sur le nom du genre
  // (Juste pour que ce soit joli visuellement)
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  return (
    <span style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fond transparent léger
      border: '1px solid ' + stringToColor(label), // Bordure colorée
      color: 'white',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      marginRight: '8px',
      marginBottom: '8px',
      display: 'inline-block',
      textTransform: 'capitalize'
    }}>
      {label}
    </span>
  );
};

export default GenreBadge;