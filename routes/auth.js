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

router.get('/', (req, res) => {
    res.send('a');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.body);
    // Simple validation (xác nhận đơn giản)
    if (!username || !password) {
        res.status(400).json({ success: false, message: 'không có username and/or password' });
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
        // Return token
        const accessToken = jwt.sign(
            {
                idUser: newUser._id,
            },
            process.env.SECRET_KEY,
            { expiresIn: 36000 },
        );
        console.log(accessToken);
        await newUser.save();
        res.json({ success: true, message: 'user created', accessToken });
        console.log(newUser);
    } catch (error) {}
});

module.exports = router;
