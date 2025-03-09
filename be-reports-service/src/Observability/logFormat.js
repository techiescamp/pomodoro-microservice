const logFormat = (req, res) => {
    return {
        host: req.headers.host,
        method: req.method,
        url: req.url,
        'x-corr-id': res.xCorrId,
        userId: res && res.userId,
        statusCode: res && res.statusCode,
        ipAddress: req.ip,
    }
}

module.exports = logFormat;