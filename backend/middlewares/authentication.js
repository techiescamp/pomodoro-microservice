const jwt = require('jsonwebtoken')
const config = require('../config')


function verifyUser(req, res, next) {
    const authHeader = req.headers['authorization']
    if(!authHeader) {
        console.log('Authorization header is missing')
        return res.status(401).json({error: 'Authorization header is missing'})
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, config.secrets.jwt_key)
        req.user = decoded
        next()
    } catch(err) {
        console.error('Invalid token or token expired')
        return res.status(402).json({error: 'Invalid user token or token expired'})
    }
}

module.exports = verifyUser