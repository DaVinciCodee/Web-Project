const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', async (req, res) => {
        const searchTerm = req.query.q?.trim();
        try {
                let userList = [];
                // const userList = await User.find();
                if (searchTerm) {
                        userList = await User.find({
                                user_name: { $regex: searchTerm, $options: "i" }
                        });
                }
                res.json(userList);
        } catch (error) {
                console.error("Erreur :", error);
                res.status(500).json({ error: "Erreur serveur" });
        }
});

module.exports = router;