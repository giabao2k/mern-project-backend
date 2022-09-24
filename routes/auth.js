// Thực hiện những công việc xác thực người dùng login logout register

const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @route POST api/auth/register
// @description Register user (mô tả)
// access Public (trạng thái)

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.body);
    // Simple validation (xác nhận đơn giản)
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'không có username and/or password' });
    }
    try {
        // Check for existing user( xem người dùng có tồn tại hay không)
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: 'đả tồn tại tên đăng kí' });
        }
        //all good
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        // Return token
        const accessToken = jwt.sign(
            {
                userId: newUser._id,
            },
            process.env.SECRET_KEY,
            { expiresIn: 36000 },
        );
        // console.log(accessToken);
        res.json({ success: true, message: 'đăng kí thành công', accessToken });
        // console.log(newUser);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
// @route POST api/auth/login
// @description Register user (mô tả)
// access Public (trạng thái)

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.body);
    // Simple validation (xác nhận đơn giản)
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'không có username and/or password' });
    }
    try {
        // Check for existing user( xem người dùng có tồn tại hay không)
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'tài khoản không đúng' });
        }
        // Username found (tên đăng nhập đúng=> check pass)
        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(400).json({ success: false, message: 'mật khẩu không đúng' });
        } else {
            // All good
            // Return token
            const accessToken = jwt.sign(
                {
                    userId: user._id,
                },
                process.env.SECRET_KEY,
                { expiresIn: 36000 },
            );
            res.json({ success: true, message: 'người dùng đăng nhập thành công', accessToken });
            // console.log(newUser);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
