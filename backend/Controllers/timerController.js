const TaskTracker = require('../Model/timerModel')
//
const logger = require('../Observability/logger')
const logFormat = require('../Observability/logFormat')
const { tracer } = require('../Observability/jaegerTrace')
const metrics = require('../Observability/metrics')
const { trace, context, propagation } = require('@opentelemetry/api')
const axios = require('axios')
const config = require('../config')
const reportsUrl = config.urls.reportsUrl

const addTask = async (req, res) => {
  const span = tracer.startSpan('Add new tasks', {
    attributes: {'x-correlation-id': req.correlationId}
  })
  metrics.httpRequestCounter.inc()

  const { addTask } = req.body
  const user = req.user
  let doc

  try {
    const isUserExisted = await TaskTracker.findOne({ "userData.userId": user.userId })
  
    if (isUserExisted) {
      // format date for display
      isUserExisted.userTasks.forEach(userTask => {
        userTask.date = new Date(userTask.date).toLocaleDateString()
      });

      const formattedDate = new Date(addTask.userTasks.date).toLocaleDateString()
      const checkDate = isUserExisted.userTasks.findIndex(i => new Date(i.date).toLocaleDateString() === formattedDate)
      // new date
      if (checkDate === -1) {
        addTask.userTasks.date = formattedDate
        isUserExisted.userTasks.push(addTask.userTasks)

      } else { // already date existed
        isUserExisted.userTasks[checkDate].tasks.push(...addTask.userTasks.tasks)
      }
      
      const filter = { 'userData.userId': { $in: [user.userId] } }
      const options = { new: true, upsert: true }
      
      // db mterics
      const queryStartTime = process.hrtime()
      doc = await TaskTracker.findOneAndUpdate(filter, isUserExisted, options)
      //
      const queryEndTime = process.hrtime(queryStartTime)
      const queryDuration = queryEndTime[0]*1e9 + queryEndTime[1]
      metrics.databaseQueryDurationHistogram.observe({operation: 'findone - user added tasks', success: isUserExisted ? 'true' : 'false'}, queryDuration)
    } 
    else {
      const payload = addTask
      // payload.userTasks.date = new Date(payload.userTasks.date).toLocaleDateString()
      console.log('new user payload: ', payload)
      
      // db mterics
      const queryStartTime = process.hrtime()
      doc = new TaskTracker(payload)
      doc.save()
      //
      const queryEndTime = process.hrtime(queryStartTime)
      const queryDuration = queryEndTime[0]*1e9 + queryEndTime[1]
      metrics.databaseQueryDurationHistogram.observe({operation: 'findone - user added tasks', success: isUserExisted ? 'true' : 'false'}, queryDuration)
    }
    // log
    const logResult = {
      emailId: user.email,
      statusCode: res.statusCode
    }
    logger.info('add task ', logFormat(req, logResult))
    span.end()
    return res.status(200).send(doc)
  }
  catch(err) {
    metrics.errorCounter.inc()
    span.setAttribute('error', true)
    span.addEvent({ event: 'error', message: 'Error to add task at backend'})
    span.end()
    return res.status(500).send({message: 'Error at backend to add task', statusCode: 'warning'})
  }

}

const getTasks = async (req, res) => {
  const span = tracer.startSpan('Get unchecked task', {
    attributes: { 'x-correlation-id': req.correlationId }
  });
  metrics.httpRequestCounter.inc();
  
  const { userId } = req.user
  try {
    // db metrics
    const queryStartTime = process.hrtime();
    const { userTasks } = await TaskTracker.findOne({ "userData.userId": userId }, { userTasks: 1 })
    //
    const queryEndTime = process.hrtime(queryStartTime);
    const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];
    metrics.databaseQueryDurationHistogram.observe({ operation: 'Fetch unchecked tasks - findOne', success: userTasks ? 'true' : 'false' }, queryDuration / 1e9);
    // 
    if(!userTasks) {

    }
    const logResult = {
      userId: userId,
      statusCode: res.statusCode
    }
    logger.info('Get unchecked task to index page', logFormat(req, logResult))

    const notCheckedTasks = userTasks.map(t => t.tasks.filter(i => !i.checked)).flat()
    span.end()
    return res.status(200).send(notCheckedTasks)
  }
  catch (err) {
    metrics.errorCounter.inc()
    span.setAttribute('error', true)
    span.addEvent({ event: 'error', message: 'Error to get unchecked task at backend'})
    span.end()
    return res.status(500).json({message: 'Error to get unchecked task at backend', statusCode: 'warning'})
  }
}

const updateTask = async (req, res) => {
  const span = tracer.startSpan('user completed task', {
    attributes: { 'x-correlation-id': req.correlationId }
  });
  metrics.httpRequestCounter.inc();

  const { userId } = req.user
  const { id } = req.params
  const updatedData = req.body

  try {
    const taskData = await TaskTracker.findOne({
      'userTasks.tasks.id': id, // Match the specific task by its ID
    });

    if (!taskData) {
      logger.info('Task not found')
      return res.status(404).send({ message: 'Task not found' });
    }
    // db 
    const queryStartTime = process.hrtime();
    const updateResult = await TaskTracker.findOneAndUpdate(
      {
        'userTasks.tasks.id': id, // Match the specific task by its ID
      },
      {
        $set: {
          'userTasks.$[].tasks.$[task].checked': updatedData.checked, // Update the `checked` field
          'userTasks.$[].tasks.$[task].act': updatedData.act,         // Update the `act` field
          'userTasks.$[].tasks.$[task].timer': updatedData.timer && updatedData.timer.split(':')[0],  // update 'timer' field
        },
      },
      {
        arrayFilters: [
          { 'task.id': id }, // Filter to match the specific task ID
        ],
        new: true, // Return the updated document
      }
    );
    //
    const queryEndTime = process.hrtime(queryStartTime);
    const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];
    metrics.databaseQueryDurationHistogram.observe({ operation: 'Update data task completion - findOneandUpdate', success: updateResult ? 'true' : 'false' }, queryDuration / 1e9);
          
    // log
    const logResult = {
      userId: userId,
      statusCode: res.statusCode,
    }
    logger.info('Task updated', logFormat(req, logResult));
    metrics.tasksCompletedCounter.inc();
    span.end();

    return res.status(200).json({info: 'Task is updated successfully!', updateResult});
  } 
  catch (err) {
    metrics.errorCounter.inc()
    span.setAttribute('error', true)
    span.addEvent({event: 'error', message: 'Error updating tasks at backend'})
    span.end()
    return res.status(500).send('error updating task')
  }
}

const editData = async (req, res) => {
  const span = tracer.startSpan('User editing task', {
    attributes: { 'x-correlation-id': req.correlationId }
  });
  metrics.httpRequestCounter.inc();

  const { id } = req.params
  const { userId } = req.user
  const { updatedTask } = req.body

  try {
    // db metrics
    const queryStartTime = process.hrtime();
    const task = await TaskTracker.findOneAndUpdate(
      { "userData.userId": userId, "userTasks.tasks.id": id },
      {
        $set: {
          "userTasks.$[].tasks.$[task].checked": updatedTask.checked,
          "userTasks.$[].tasks.$[task].title": updatedTask.title,
          "userTasks.$[].tasks.$[task].description": updatedTask.description,
          "userTasks.$[].tasks.$[task].act": updatedTask.act,
          "userTasks.$[].tasks.$[task].timer": updatedTask.timer,
        }
      },
      { arrayFilters: [{ "task.id": id }], new: true }
    )
    //
    const queryEndTime = process.hrtime(queryStartTime);
    const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];
    metrics.databaseQueryDurationHistogram.observe({ operation: 'Update task - findOneandUpdate', success: task ? 'true' : 'false' }, queryDuration / 1e9);


    // log
    const logResult = {
      userId: userId,
      statusCode: res.statusCode
    }
    if (!task) {
      // log
      logger.info('Task not found to edit', logFormat(req, logResult));
      span.end();
      return res.status(404).json({ message: 'Task not found or user mismatch' });
    }
    // log
    logger.info('Task Edited', logFormat(req, logResult));
    span.end();
    return res.status(200).json({ message: 'Task edited successfully', updatedTask: task });
  }
  catch (err) {
    metrics.errorCounter.inc()
    span.setAttribute('error', true)
    span.addEvent({ event: 'error', message: 'Error edit task at backend' })
    span.end()
    return res.status(500).json({ message: 'Error editng task', error: err });
  }
}

const deleteTask = async (req, res) => {
  const span = tracer.startSpan('Delete task', {
    attributes: { 'x-correlation-id': req.correlationId }
  });
  metrics.httpRequestCounter.inc();

  const { id } = req.params
  const { userId } = req.user

  try {
    // db metrics
    const queryStartTime = process.hrtime();
    const result = await TaskTracker.updateOne(
      { "userData.userId": userId }, // Find the document by userId
      { $pull: { "userTasks.$[].tasks": { id: id } } } // Pull the task with matching id
    );
    //
    const queryEndTime = process.hrtime(queryStartTime);
    const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];
    metrics.databaseQueryDurationHistogram.observe({ operation: 'delete task - UpdateOne and pull', success: result ? 'true' : 'false' }, queryDuration / 1e9);

    ////
    const logResult = {
      userId: userId,
      statusCode: res.statusCode,
    }
    if (result.modifiedCount > 0) {
      // log
      logger.info('deleted task', logFormat(req, logResult));
      span.end();
      return res.send('Task deleted successfully');
    }
    else {
      // log
      logger.info('task not found to delete', logFormat(req, logResult));
      span.end();
      return res.send('Task not found or already deleted');
    }
  } catch (err) {
    metrics.errorCounter.inc()
    span.setAttribute('error', true)
    span.addEvent({ event: 'error', message: 'Error to delete task at backend' })
    span.end()
    return res.send('Error deleting task: ', err);
  }
}

//  call another service
const getAllTasks = async (req, res) => {
  const { userId } = req.user

  const span = tracer.startSpan('get all tasks and send reports to frontend [backend <- reports] microservice', {
      attributes: { 'x-correlation-id': req.correlationId }
  });
  metrics.httpRequestCounter.inc()

  // set current context with new span
  const ctx = trace.setSpan(context.active(), span)
  trace.setSpan(context.active(), span)

  try {
      span.addEvent('Service context Propagating to Reports-Service')
      // run following code within the context of new span
      const headers = {
          'Content-Type': 'application/json',
          'x-correlation-id': req.correlationId, // req.body.xCorrId
      }
      await context.with(ctx, async () => {
          // inject trace context into headers
          propagation.inject(context.active(), headers);

          const result = await axios.post(`${reportsUrl}/api2/getAllTasks`, 
            { userId }, 
            { headers: headers }
          ) 
          const logResult = {
            userId: req.user.userId,
            statusCode: res.statusCode
          }
          if(result.data.isTaskFetched) {
            span.addEvent('Fetchedtasks from reports service')
            logger.info('Fetched tasks from reports service', logFormat(req, logResult))
            return res.status(200).json(result.data.existingUser)
          }
      })
  }
  catch (err) {
      logger.error('Error in reportService', {
          error: err.message,
          user: req.body,
          correlationId: req.correlationId
      });
      span.setStatus({code: 2, message: err.message}) // code 2 - error
      span.setAttribute('error', true); // Mark this span as an error
      return res.status(500).json({error: 'interal error at "main backend" service'})
  }
  finally {
      span.end()
  }

}


module.exports = {
  addTask,
  getTasks,
  getAllTasks,
  updateTask,
  editData,
  deleteTask
}
