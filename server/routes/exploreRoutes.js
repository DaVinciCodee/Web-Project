const express = require('express');
const router = express.Router();

const { findUsers, findUser, findAlbums, findArtists, findSongs } = require("../controllers/exploreController");

router.get("/users", findUsers);
router.get("/user", findUser);
router.get("/artists", findArtists);
router.get("/albums", findAlbums);
router.get("/songs", findSongs);

module.exports = router;