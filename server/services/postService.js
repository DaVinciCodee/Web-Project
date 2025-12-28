const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');

const findUserById = (spotifyId) => {
    return User.findOne({ spotifyId });
}

const createPost = (user, content) => {
    return Post.create({
        postId: new mongoose.Types.ObjectId().toString(),
        postUserName: user.user_name,
        postContent: content,
    });
}

const getLatestPost = () => {
    return Post.findOne().sort({ createdAt: -1 });
}

module.exports = {
    findUserById,
    createPost,
    getLatestPost
}