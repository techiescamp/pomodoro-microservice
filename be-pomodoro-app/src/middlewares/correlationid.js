const { v4: uuidv4 } = require('uuid');

const correlationIdMiddleware = (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req.correlationId = correlationId;
    next();
};

module.exports = correlationIdMiddleware;