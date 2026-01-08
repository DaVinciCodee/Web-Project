const postService = require('../services/postService');

module.exports.createPost = async (req, res) => {

    console.log("Post en cours de création 2");

    try {
        const { content, spotifyId } = req.body;

        if (!content || !spotifyId) {
            return res.status(400).json({ message: "Données manquantes" });
        }

        const user = await postService.findUserById(spotifyId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const post = await postService.createPost(user, content);

        res.status(201).json(post);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

module.exports.displayPost = async (req, res) => {
    try {
        // const latestPost = await postService.getLatestPost();
        const allPosts = await postService.getAllPosts();

        if (!allPosts) {
            return res.status(404).json({ message: "Pas de post trouvé" });
        }

        res.json(allPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}