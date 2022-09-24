const jwt = require('jsonwebtoken');

// Authorization: Bearer ajkgnklnakfb;

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'không tìm thấy mã token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'có token mà hàng lởm' });
    }
};

module.exports = verifyToken;
