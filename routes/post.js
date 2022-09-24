const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Post = require('../models/Post');

// @route GET api/post
// @desc get post
// @access private

router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', ['username']);
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// @route POST api/post
// @desc create post
// @access private
//1h15p

router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    if (!title) {
        res.status(400).json({ success: false, message: 'chưa có tiêu đề' });
    }
    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId,
        });
        await newPost.save();
        res.json({ success: true, message: 'Tạo post thành công', newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
