// Controllers for post routes
const postService = require('../services/postService');

// Create a new post
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

// Display posts
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


// Get metadata from a URL
module.exports.getUrlMetadata = async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL manquante." });
        }

        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SpotiMateBot/1.0)' }
        });

        const $ = cheerio.load(data);

        const metaTags = {
            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
            description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
            image: $('meta[property="og:image"]').attr('content'),
            siteName: $('meta[property="og:site_name"]').attr('content'),
            url: url
        };
        
        res.json(metaTags);
    } catch (error) {
        console.error("Erreur getUrlMetadata:", error.message);
        res.json({ title: null, image: null });
    }
};

module.exports.createLike = async (req, res) => {

    console.log("Post en cours de création 2");


    try {
        const { postId, } = req.body;

        if (!postId) {
            return res.status(400).json({ message: "Données manquantes" });
        }

        const post = await postService.likePost(postId);

        res.status(201).json(post);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}


