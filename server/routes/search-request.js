const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Functions to find the users corresponding to the search
router.get('/users/', async (req, res) => {

        const searchTerm = req.query.q?.trim();

        try {
                let userList = await User.find();
                let userFound = [];

                if (searchTerm) {
                        const regex = new RegExp(searchTerm.replace(/\s+/g, ""), "i");
                        userFound = userList.filter(user => {
                                const usernameClean = (user.user_name || "").replace(/\s+/g, "");
                                return regex.test(usernameClean) && user.user_name !== "Spotimate";
                        });
                }

                res.json(userFound);
        } catch (error) {
                console.error("Erreur :", error);
                res.status(500).json({ error: "Erreur serveur" });
        }
});

// Get Artists
router.get('/artists/', async (req, res) => {

        const searchTerm = req.query.q?.trim();

        const user = await User.findOne({ user_name: "Turn down?" });
        const accessToken = user?.accessToken;

        console.log("Access Token:", accessToken);
        console.log("Search Term :", searchTerm);

        let artistParams = {
                method: "GET",
                headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                },
        };

        // Get Artist
        const artists = await fetch(
                "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=artist",
                artistParams
        )
                .then((result) => result.json())
                .then((data) => {
                        // Retourner les 5 premiers
                        if (!data.artists || !data.artists.items) {
                                console.log("pas d'artiste");
                                return [];
                        }
                        console.log("artistes trouvés");
                        return data.artists.items.slice(0, 5);
                });
        

        res.json(artists);
})

module.exports = router;