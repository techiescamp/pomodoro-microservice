require('dotenv').config();

const config = {
    server: {
        port: process.env.PORT
    },
    database: {
        mongoUrl: process.env.MONGODB_URL
    },
    secrets: {
        jwt_key: process.env.JWT_SECRET
    },
    session: {
        secret: process.env.SESSION_SECRET
    },
    urls: {
        baseUrl: process.env.BASE_URL,
        reportsUrl: process.env.REPORTS_URL
    },
    mail: {
        email: process.env.ZOHO_MAIL,
        password: process.env.ZOHO_PASSWORD
    },
    observability: {
        jaeger_trace_url: process.env.JAEGER_TRACE_URI
    }
}

module.exports = config;