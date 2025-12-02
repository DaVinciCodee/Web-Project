// services/recommendationService.js

// Fonction Helper : Indice de Jaccard (0 à 1)
const calculateJaccard = (listA, listB) => {
    if (!listA || !listB || listA.length === 0 || listB.length === 0) return 0;
    
    const setA = new Set(listA);
    const setB = new Set(listB);
    
    // Combien d'éléments identiques ?
    const intersection = [...setA].filter(item => setB.has(item));
    // Combien d'éléments au total (sans doublon) ?
    const union = new Set([...setA, ...setB]);
    
    return union.size === 0 ? 0 : intersection.length / union.size;
};

exports.calculateCompatibility = (userA, userB) => {
    // 1. Préparation des IDs pour comparaison
    const genresA = userA.topGenres || [];
    const genresB = userB.topGenres || [];

    const artistsA = userA.topArtists.map(a => a.spotifyId);
    const artistsB = userB.topArtists.map(b => b.spotifyId);

    const tracksA = userA.topTracks.map(t => t.spotifyId);
    const tracksB = userB.topTracks.map(t => t.spotifyId);

    // 2. Calcul des scores unitaires
    const scoreGenres = calculateJaccard(genresA, genresB);
    const scoreArtists = calculateJaccard(artistsA, artistsB);
    const scoreTracks = calculateJaccard(tracksA, tracksB);

    // 3. Pondération (Tu peux ajuster l'importance ici)
    // Genres = Vibe générale (50%)
    // Artistes = Fan base commune (30%)
    // Tracks = Match parfait (20%) - c'est dur d'avoir les mêmes sons exacts
    const totalScore = (scoreGenres * 0.5) + (scoreArtists * 0.3) + (scoreTracks * 0.2);

    return {
        percent: (totalScore * 100).toFixed(0) + '%',
        details: {
            commonGenres: (scoreGenres * 100).toFixed(0) + '%',
            commonArtists: (scoreArtists * 100).toFixed(0) + '%',
            commonTracks: (scoreTracks * 100).toFixed(0) + '%'
        }
    };
};