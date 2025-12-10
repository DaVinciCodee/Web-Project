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

router.get('/albums/', async (req, res) => {
        res.json("Test réussi.");
})

module.exports = router;