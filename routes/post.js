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
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// @route PUT api/post/:id
// @desc update post
// @access private

router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;
    if (!title) {
        res.status(400).json({ success: false, message: 'chưa có tiêu đề' });
    }
    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 'TO LEARN',
        };

        const postUpdateCondition = { _id: req.params.id, user: req.userId };
        // console.log(postUpdateCondition);
        // req.params.id là giá trị id trên url
        // user là user mà người dùng gửi req đấy( ở cái verifyToken ấy)

        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, { new: true });

        if (!updatedPost) {
            return res.status(401).json({ success: false, message: 'Post hoặc người dùng không tồn tại ' });
        }
        res.json({ success: true, message: 'Cập nhật post thành công', updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// @route DELETE api/post/:id
// @desc delete post
// @access private

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id, user: req.userId };
        const deletedPost = await Post.findByIdAndDelete(postDeleteCondition);
        if (!deletedPost) {
            return res.status(401).json({ success: false, message: 'Post hoặc người dùng không tồn tại ' });
        }
        res.json({ success: true, post: deletedPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
