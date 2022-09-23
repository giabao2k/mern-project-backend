const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const authRouter = require('./routes/auth');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

connectDB();

const app = express();
app.use(express.json()); // đọc username với password
const PORT = 5000;

app.use('/api/auth', authRouter);
app.get('/', (req, res) => res.send('hello world'));

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
