exports.calculeJaccard = (arrA, arrB) => {
    const setA = new Set(arrA);
    const setB = new Set(arrB);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    if (union.size === 0) return 0; 
    return intersection.length / union.size;
}

exports.calculeVibeSimilarity = (featureA, featureB) => {
    const keys = ['accousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'valence'];
    let sum = 0;
    if (!featureA || !featureB) return 0.5;
    keys.forEach(key => {
        let diff = Math.abs(featureA[key] - featureB[key]);
        sum += diff*diff;
    });
    const distance = Math.sqrt(sum);
    const maxDistance = Math.sqrt(keys.length);
    const similarity = 1 - (distance / maxDistance);
    return Math.max(0, similarity);
}