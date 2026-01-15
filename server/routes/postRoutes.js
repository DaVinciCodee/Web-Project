const express = require('express');
const router = express.Router();

const { createPost, displayPost, createLike } = require("../controllers/postController");

router.post("/create-post", createPost);
router.post("/create-like", createLike);
router.get("/display-post", displayPost);


module.exports = router;