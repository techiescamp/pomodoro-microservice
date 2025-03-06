const logFormat = (req, result) => {
    return {
        host: req.headers.host,
        ipAddress: req.ip,
        method: req.method,
        url: req.url,
        'x-corr-id': req.correlationId,
        userId: result.userId,
        statusCode: result.statusCode,
    }
}

module.exports = logFormat;