const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, 'asd#@Rdcf42rWewedfwWEFd');
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (e) {
        return next(new HttpError('Authentication failed!', 403));
    }
};
