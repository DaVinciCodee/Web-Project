const Post = require('../models/Post');
const User = require('../models/User');

const findUserById = (spotifyId) => {
    return User.findOne({ spotifyId });
}

const createPost = (user, content) => {
    return Post.create({
        postUserName: user.user_name,
        postContent: content,
        postLikes: false,
    });
}

const getLatestPost = () => {
    return Post.findOne().sort({ createdAt: -1 });
}

const getAllPosts = () => {
    return Post.find().sort({ createdAt: -1 });
}

const likePost = (postId) => {
    return Post.findByIdAndUpdate(postId, { $inc: { postLikes: 1 } }, { new: true });
}

module.exports = {
    findUserById,
    createPost,
    getLatestPost,
    getAllPosts,
    likePost,
}