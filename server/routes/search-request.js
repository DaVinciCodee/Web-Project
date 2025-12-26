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

router.get('/user/', async (req, res) => {

        const userId = req.query.q?.trim();

        if (!userId) {
                return res.status(400).json({ error: "Paramètre 'q' manquant" });
        }

        try {
                const user = await User.findOne({ user_name: userId });

                if (!user) {
                        return res.status(404).json({ message: "Utilisateur introuvable" });
                }

                res.json(user);
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

        let artistParams = {
                method: "GET",
                headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                },
        };

        // Get Artist
        const artists = await fetch(
                "https://api.spotify.com/v1/search?q=" + encodeURIComponent(searchTerm) + "&type=artist" + "&limit=10",
                artistParams
        )
                .then((result) => result.json())
                .then((data) => {
                        // Retourner les 5 premiers
                        if (!data.artists || !data.artists.items) {
                                console.log("Pas d'artiste");
                                return [];
                        }
                        console.log("Artistes trouvés");
                        return data.artists.items.slice(0, 5);
                });


        res.json(artists);
})

// Get Albums
router.get('/albums/', async (req, res) => {

        const searchTerm = req.query.q?.trim();

        const user = await User.findOne({ user_name: "Turn down?" });
        const accessToken = user?.accessToken;

        console.log("Access Token:", accessToken);
        console.log("Search Term :", searchTerm);

        let albumsParams = {
                method: "GET",
                headers: {
                        Authorization: "Bearer " + accessToken,
                },
        };

        // Get Album
        const response = await fetch(
                "https://api.spotify.com/v1/search?q=" + encodeURIComponent(searchTerm) + "&type=album" + "&limit=10",
                albumsParams
        );

        const data = await response.json();

        let albums = [];

        if (data.albums?.items) {
                albums = data.albums.items.slice(0, 5);
                // console.log("Albums trouvés");
        } else {
                // console.log("Pas d'albums");
        }

        res.json(albums);
})

// Get Songs
router.get('/songs/', async (req, res) => {

        const searchTerm = req.query.q?.trim();

        const user = await User.findOne({ user_name: "Turn down?" });
        const accessToken = user?.accessToken;

        console.log("Access Token:", accessToken);
        console.log("Search Term :", searchTerm);

        let songsParams = {
                method: "GET",
                headers: {
                        Authorization: "Bearer " + accessToken,
                },
        };

        // Get Songs
        const response = await fetch(
                "https://api.spotify.com/v1/search?q=" + encodeURIComponent(searchTerm) + "&type=track" + "&limit=10",
                songsParams
        );

        const data = await response.json();

        let songs = [];

        if (data.tracks?.items) {
                songs = data.tracks.items.slice(0, 5);
                // console.log("Morceaux trouvés");
        } else {
                // console.log("Pas de morceaux");
        }

        res.json(songs);
})

module.exports = router;