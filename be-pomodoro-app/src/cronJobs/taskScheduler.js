const cron = require('node-cron')
const User = require('../Model/userModel')
const TaskTracker = require('../Model/timerModel')
const moment = require('moment-timezone')


const taskScheduler = () => {
    cron.schedule('0 0 * * *', async() => {
        console.log('*** Cron job started ****')
        const users = await User.find()
        for(const user of users) {
            const getTaskList = await TaskTracker.find(
                { "userData.email": user.email },
                {_id: 0, userTasks: 1}
            )
            console.log(`gettask - ${user.displayName} - [cron]`)
            const nextDate = moment().tz('Asia/Kolkata').add(1, 'day').startOf('day').toDate()

            let uncheckedTasks = []

            const updatedTaskGroup = getTaskList[0]?.userTasks.map(taskGroup => {
                const unTasks = taskGroup.tasks.filter(t => !t.checked)
                uncheckedTasks.push(...unTasks)
                // keep only checked tasks in current taskGroup
                taskGroup.tasks = taskGroup.tasks.filter(t => t.checked)
                return taskGroup.tasks.length > 0 ? taskGroup : null; // Keep non-empty groups
            }).filter(Boolean); // Remove null entries (empty groups)


            // if there are unchecked tasks, create new task group for next day
            if(uncheckedTasks.length > 0) {
                updatedTaskGroup.push({
                    date: nextDate,
                    tasks: uncheckedTasks
                })
            }

            // update database
            await TaskTracker.findOneAndUpdate(
                {"userData.email": user.email}, 
                {"$set": { userTasks: updatedTaskGroup }},
                {new: true, upsert: true}
            )
        }
        // end for
    }, { timezone: 'Asia/Kolkata' })
}

module.exports = taskScheduler