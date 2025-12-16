const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {

        postId: {
            type: String,
            required: true,
        },

        postUserName: {
            type: String,
            required: true
        },

        // postDate: {
        //     type: Date,
        //     default: Date.now
        // },

        postContent: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

PostSchema.index({ postId: 1 }, { unique: true });

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);