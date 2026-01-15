const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        postUserName: {
            type: String,
            required: true
        },

        postContent: {
            type: String,
            required: true
        },

        postLikes:{
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);