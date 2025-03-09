const User = require('../Model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../Observability/logger');
const logFormat = require('../Observability/logFormat');
const { tracer } = require('../Observability/jaegerTrace');
const metrics = require('../Observability/metrics');
const { isDisposable, generateUserId, storeActiveUsers } = require('../utils')

const signup = async (req, res) => {
    const span = tracer.startSpan('Signup', {
        attributes: { 'x-correlation-id': req.correlationId }
    });
    // start metrics
    metrics.httpRequestCounter.inc();
    const { register } = req.body

    // check for disposable email address
    const isEmailDisposable = isDisposable(register.email)
    if(isEmailDisposable) {
        return res.status(500).json({
            message: "This type of email address is not permitted",
            status: 'warning'
        })
    } else {
        const queryStartTime = process.hrtime();
        const exisitngUser = await User.findOne({ email: req.body.email });
            //
        const queryEndTime = process.hrtime(queryStartTime);
        const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];
        metrics.databaseQueryDurationHistogram.observe({operation: 'findOne: check if user existed via email', success: exisitngUser ? 'true': 'false'}, queryDuration / 1e9);
            
        if(exisitngUser) {
            return res.status(400).json({
                message: "User already registered",
                status: "warning"
            })
        }

        try {
            const hashedPassword = bcrypt.hashSync(register.password, 8);
            const uid = await generateUserId(register.displayName)
            const payload = new User({
                userId: uid,
                displayName: register.displayName,
                email: register.email,
                password: hashedPassword
            })
            payload.save()
            const logResult = {
                userId: uid,
                email: register.email,
                statusCode: res.statusCode,
            }
            logger.info('user registered success', logFormat(req, logResult));
            //
            metrics.newUsersCounter.inc();
            return res.status(200).json({
                message: "Registered Successfully",
                xCorrId: req.headers['x-correlation-id'],
                status: 'success'
            })
        } catch (err) {
            span.addEvent('Catch Error during registration', { 'error': err.message });
            metrics.errorCounter.inc();
            span.setAttribute('error', true); // Mark this span as an error
            logger.error('Error in registration')
            span.end();
        }
    } // end else
}

const login = async (req, res) => {
    const span = tracer.startSpan('Login', {
        attributes: { 'x-correlation-id': req.correlationId }
    });
    metrics.httpRequestCounter.inc();

    const { email, password } = req.body.userLogin

    try {
        const queryStartTime = process.hrtime();
        const exisitngUser = await User.findOne({ email: email });
        //
        const queryEndTime = process.hrtime(queryStartTime);
        const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];
        metrics.databaseQueryDurationHistogram.observe({operation: 'findOne: user login via email', success: exisitngUser ? 'true': 'false'}, queryDuration / 1e9);
        
        const logResult = {
            userId: exisitngUser.userId,
            email: email,
            statusCode: res.statusCode,
        }
        const userWithoutPassword = {
            userId: exisitngUser.userId,
            name: exisitngUser.displayName,
            email: exisitngUser.email
        }

        if(!exisitngUser) {
            span.addEvent('login password incorrect', { requestBody: JSON.stringify(logResult) })
            logger.info('Password is incorrect', logFormat(req, logResult));
            metrics.errorCounter.inc();
            span.setAttribute('error', true); // Mark this span as an error
            span.end();

            return res.status(401).json({
                message: "Password is incorrect",
                status: 'warning'
            })
        } else {
            // for dau
            storeActiveUsers(exisitngUser.userId);
            const comparePassword = bcrypt.compareSync(password, exisitngUser.password);
            if (comparePassword) {
                const payload = {
                    id: exisitngUser._id,
                    userId: exisitngUser.userId
                }
                const user_token = jwt.sign(payload, config.secrets.jwt_key, { expiresIn: 84600 });            
                //
                span.addEvent('user logged', { requestBody: JSON.stringify(logResult) })
                logger.info('user logged in info is passed to server', logFormat(req, logResult))
                span.end();

                return res.status(200).json({
                    message: 'user login success',
                    token: user_token,
                    user: userWithoutPassword,
                    status: 'success'
                })
            }
        } 
    } catch(err) {
        span.addEvent('Catch Error during login', {'error': err.message});
        metrics.errorCounter.inc();
        span.setAttribute('error', true); // Mark this span as an error
        span.end();
        return res.status(500).json({message: `Catch Error during login ${err.message}`, status: 'warning'})
    }
}

const isUserVerified = async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        return res.status(200).send(user)
    } catch(err) {
        return res.status(500).json({message: 'werver error. JWT not verified user token', statusCode: 'warning'})
    }
}

const updateUser = async (req, res) => {
    const span = tracer.startSpan('UpdateUser', {
        attributes: { 'x-correlation-id': req.correlationId }
    });
    //start metrics
    metrics.httpRequestCounter.inc();

    try {
        const { userId } = req.user
        const { profile } = req.body
        let update;
        if (profile.password) {
            const hashedPassword = bcrypt.hashSync(profile.password, 8);
            update = {
                displayName: profile.displayName,
                password: hashedPassword
            }
        } else {
            update = {
                displayName: profile.displayName,
            }
        }
        const queryStartTime = process.hrtime();
        const user = await User.findOneAndUpdate({ userId: userId }, update, { new: true })
        //
        const queryEndTime = process.hrtime(queryStartTime);
        const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];
        metrics.databaseQueryDurationHistogram.observe({operation: 'update user - findOneAndUpdate', success: user ? 'true': 'false'}, queryDuration / 1e9);
        // logg
        const logResult = {
            userId: user.userId,
            statusCode: res.statusCode,
        }
        span.addEvent('upated user profile');
        logger.info('updated user info', logFormat(req, logResult))
        span.end();
        return res.status(200).json({ message: "updated your profile", result: user })
    } catch(err) {
        span.setAttribute('error', true); // Mark this span as an error
        span.addEvent('Error in updating user', {'error': err.message});
        logger.error('Error in updating user info')
        metrics.errorCounter.inc();
        span.end();
        return res.status(500).json({msg: "Error in updating user profile "})
    }
}

const logout = (req, res) => {
    const span = tracer.startSpan('user logout', {
        attributes: { 'x-correlation-id': req.correlationId }
    });
    metrics.httpRequestCounter.inc();

    const isUser = req.userId

    const logResult = {
        userId: isUser.userId,
        statusCode: res.statusCode,
    }
    span.addEvent('User logged out!!')
    logger.info('User logged out!', logFormat(req, logResult));
    span.end();
    if(isUser) return res.status(200).redirect(config.urls.baseUrl)
}


module.exports = {
    signup,
    login,
    isUserVerified,
    updateUser,
    logout
}