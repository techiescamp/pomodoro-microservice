const User = require('./Model/userModel');
const metrics = require('./Observability/metrics')

let activeUser = new Set()

const storeActiveUsers = (userId) => {
    if(userId) {
        activeUser.add(userId);
        // set activeuser gauge
        metrics.activeUsersGauge.set(activeUser.size);
    } else {
        res.status(400).send('user ID required')
    }
    const resetActiveUser = () => {
        activeUser = new Set();
        metrics.activeUsersGauge.set(0)
    }
    const scheduleDailyReset = () => {
        const now = new Date();
        const midnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 0, 0
        );
        const timeLeft = midnight - now;
        setTimeout(() => {
            resetActiveUser();
            scheduleDailyReset();
        }, timeLeft)
    }
    scheduleDailyReset();
    return activeUser
}

// unique user-id
const generateUserId = async(name) => {
    const uid = `POMO-${Math.ceil(Math.random()*2000)}-${name}`;
    const checkUser = Boolean(await User.findOne({userId: uid}));

    if(uid === checkUser.userId) {
        return generateUserId(name);
    }
    return uid
}


// disposable email address
const disposableEmailDomain = [
    "admin@crunchops.com",
    "test@gmail.com"
]

const isDisposable = (email) => {
    const emailAddressName = email
    return disposableEmailDomain.includes(emailAddressName)
}


module.exports = {
    generateUserId,
    storeActiveUsers,
    isDisposable
}