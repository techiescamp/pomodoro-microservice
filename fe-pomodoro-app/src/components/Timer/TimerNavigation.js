import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTimer } from '../../context/TimerContext';
import { useTask } from '../../context/TaskContext';
import clickSound from '../../assets/audio/Mouse_Click.mp3';
import alarmSound from '../../assets/audio/clock-alarm.mp3';
import config from '../../config';
import axios from 'axios';
import './timer.css';

const apiUrl = config.apiUrl;
const metricUrl = config.metrics_url

const TimerNavigation = () => {
  const { user } = useAuth(); // Check if guest or user
  const { timer, setTimer, setBg } = useTimer();
  const { setIsTodo, list, roundsCompleted, setRoundsCompleted, setIsNoUserTodo } = useTask();
  const token = sessionStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('timer');
  const [intervalId, setIntervalId] = useState(null);
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [message, setMessage] = useState(null);

  const [shortBreakCounter, setShortBreakCounter] = useState(0); // New state for short break counter
  const [longBreakCounter, setLongBreakCounter] = useState(0);   // New state for long break counter

  // For audio
  const clickAudio = useMemo(() => new Audio(clickSound), []);
  const alarmAudio = useMemo(() => new Audio(alarmSound), []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeFormat = `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
    return timeFormat;
  };

  const getCustomTimer = () => {
    const customTimer = JSON.parse(sessionStorage.getItem('customTimer'));
    return customTimer || {
      timer: 25,
      short_break: 5,
      long_break: 15,
    };
  };

  const customTimers = getCustomTimer();

  const defaultTimers = {
    timer: Number(customTimers.timer) * 60,
    short: Number(customTimers.short_break) * 60,
    long: Number(customTimers.long_break) * 60,
  };

  const bgColors = {
    timer: '#b62525',
    short: '#643A6B',
    long: '#005B41',
  };

  const handleTab = (tab) => {
    stopTimer();
    setActiveTab(tab);
    setTimer(defaultTimers[tab]);
    setBg(bgColors[tab] || '#ffffff');
  };

  // update metric to backend
  const updateMetric = async (event, value) => {
    try{
      await axios.post(`${metricUrl}`, { event, value })
    } catch(err) {
      console.error('Failed to udate metric: ', err)
    }
  }

  const startTimer = () => {
    if (!isTimerStart) {
      if (clickAudio) clickAudio.play();
      updateMetric('start')
      setIsTimerStart(true);
    }
  };

  const stopTimer = () => {
    if (clickAudio) { clickAudio.play() }
    updateMetric('interrupt')
    setIsTimerStart(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const resetTimer = () => {
    if (clickAudio) clickAudio.play();
    updateMetric('interrupt')
    stopTimer();
    setTimer(defaultTimers[activeTab]);
  };

  const notifyUser = async (taskId) => {
    const updateTaskElement = list?.find(t => t.id === taskId);
    if(!updateTaskElement) {
      return;
    }
    setIsTimerStart(false); // Ensure the start button works properly

    const shouldSubmit = window.confirm('Your rounds are over. Do you want to submit the task or continue?')
    const updates = shouldSubmit ? 
      { ...updateTaskElement, checked: true, timer: formatTime(timer) } 
      :
      { ...updateTaskElement, act: 1, timer: formatTime(timer) }
    const successMsg = updates.checked ? 'Task submitted' : 'Task rest'
    const errorMsg = updates.checked ? 'Error submitting task' : 'Error resetting task'
    await updateTask(taskId, updates, successMsg, errorMsg)
  };

  const updateTask = async (id, updates, successMessage, errorMessage) => {
    try {
      const resp = user ? await axios.put(
        `${apiUrl}/api/updateTask/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      ) : null
      if (user && resp?.data) {
        handleSuccess(successMessage)
      } else if (!user) {
        handleGuestTaskUpdate(updates, successMessage)
      } else {
        setMessage(errorMessage);
      }
    } catch (err) {
      setMessage(`Exception error in updating task: ${err}`);
    } finally {
      setTimer(defaultTimers[activeTab]); // Reset timer for the next round
    }
  };

  const handleSuccess = (successMessage) => {
    setRoundsCompleted(0);
    setIsTimerStart(false);
    setIsTodo((prev) => prev + 1);
    setMessage(successMessage);
  }

  const handleGuestTaskUpdate = (updates, successMessage) => {
    const tasks = JSON.parse(sessionStorage.getItem('no_user_todo'));
    const updatedTaskList = tasks.map(t => (t.id === updates.id ? { ...updates } : t));
    sessionStorage.setItem('no_user_todo', JSON.stringify(updatedTaskList));
    setRoundsCompleted(0);
    setIsTimerStart(false);
    setIsNoUserTodo((prev) => prev + 1);
    setMessage(successMessage);
  }

  const handleTimerTick = (prevTime, taskId, actLimit) => {
    if (prevTime <= 1) {
      // Stop timer
      if(alarmAudio) { alarmAudio.play() }
      stopTimer();
      
      // update break counters if applicable
      if(activeTab === 'short') {
        const newShortBreakCounter = shortBreakCounter + 1
        setShortBreakCounter(newShortBreakCounter)
        updateMetric('short', newShortBreakCounter)
      } else if(activeTab === 'long') {
        const newLongBreakCounter = longBreakCounter + 1
        setLongBreakCounter(newLongBreakCounter)
        updateMetric('long', newLongBreakCounter)
      }

      // Update rounds
      if(taskId) {
        const updatedRounds = roundsCompleted + 1;
        setRoundsCompleted(updatedRounds);
        // Notify user if rounds are complete
        if (updatedRounds >= actLimit) {
          setTimeout(() => notifyUser(taskId), 1000); // Slight delay for smoother audio play
        }
      }

      setTimer(defaultTimers[activeTab]); // Reset timer for the next round
      // startTimer()
      return defaultTimers[activeTab]; // Prevent timer from going below 0
    }
    return prevTime - 1;
  }

  useEffect(() => {
    if (!isTimerStart) {
      if(intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      return
    } 

    const firstIncompleteTask = list?.find(t => !t.checked);
    const taskId = firstIncompleteTask?.id
    const actLimit = firstIncompleteTask?.act || 0

    const id = setInterval(() => {
      setTimer(prev => handleTimerTick(prev, taskId, actLimit))
    }, 1000)
    setIntervalId(id)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
    }
  }, [isTimerStart]);


  const getTabLabel = (tab) => {
    if (tab === 'timer') return 'Timer';
    if (tab === 'short') return 'Short Break';
    return 'Long Break';
  };

  return (
    <div className="my-2 w-100 text-center">
      {message && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>{message}</strong>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setMessage(null)}
          ></button>
        </div>
      )}
      <nav id="timer-nav">
        <ul className="nav-pills timer-pill d-flex justify-content-center align-items-center" id="pills-tab" role="tablist">
          {['timer', 'short', 'long'].map((tab) => (
            <li key={`${tab}`} className="nav-item rounded-pill py-1 px-md-4 px-0 me-3">
              <Link
                type="button"
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                data-bs-toggle="pill"
                role="tab"
                aria-controls={`pills-${tab}`}
                aria-selected={activeTab === tab}
                onClick={() => handleTab(tab)}
              >
                {getTabLabel(tab)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="tab-content m-2 text-white fw-semibold" id="pills-tabContent">
        {['timer', 'short', 'long'].map((tab) => (
          <div
            key={`${tab}`}
            className={`tab-pane fade ${activeTab === tab ? 'show active' : ''}`}
            id={`pills-${tab}`}
            role="tabpanel"
            aria-labelledby={`pills-${tab}-tab`}
          >
            {timer && formatTime(timer)}
          </div>
        ))}
      </div>

      <div className="text-center mt-3">
        <button onClick={startTimer} className="btn text-white fs-4 fw-bold">
          <i className="bi bi-play-circle"></i>
        </button>
        <button onClick={stopTimer} className="btn text-white fs-4 fw-bold">
          <i className="bi bi-stop-circle"></i>
        </button>
        <button onClick={resetTimer} className="btn fs-4 text-white fw-bold">
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>
  )
}

export default TimerNavigation;