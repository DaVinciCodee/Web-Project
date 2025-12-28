const express = require('express');
const router = express.Router();

const { createPost, displayPost } = require("../controllers/postController");

router.get("/create-post", createPost);
router.get("/display-post", displayPost);

module.exports = router;