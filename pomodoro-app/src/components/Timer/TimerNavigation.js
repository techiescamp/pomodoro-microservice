import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTimer } from '../../context/TimerContext'
import './timer.css'
import { useTask } from '../../context/TaskContext'
import clickSound from '../../assets/audio/Mouse_Click.mp3';
import alarmSound from '../../assets/audio/clock-alarm.mp3';
import axios from 'axios'

const TimerNavigation = () => { 
    const { timer, setTimer, setBg } = useTimer()
    const { setIsTodo, list } = useTask()
    const token = sessionStorage.getItem('token')

    const [activeTab, setActiveTab] = useState('timer')
    const [intervalId, setIntervalId] = useState(null)
    const [isTimerStart, setIsTimerStart] = useState(false)
    const [roundsCompleted, setRoundsCompleted] = useState(0)
    const [message, setMessage] = useState(null)

    // for audio
    const clickAudio = useMemo(() => new Audio(clickSound), [])
    const alarmAudio = useMemo(() => new Audio(alarmSound), [])

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60
        const timeFormat = `${String(minutes)}:${String(seconds).padStart(2, '0')}`
        return timeFormat
    }  

    const getCustomTimer = () => {
        // try{
            const customTimer = JSON.parse(sessionStorage.getItem('customTimer'))
            return customTimer || {
                timer: 25,
                short_break: 5,
                long_break: 15
            }
        // } catch(err) {
        //     console.error("Invalid custom timer format: ", err)
        //     return {
        //         timer: 25,
        //         short_break: 5,
        //         long_break: 15
        //     }
        // }
    }

    const customTimers = getCustomTimer();

    const defaultTimers = {
        timer: Number(customTimers.timer) * 60,
        short: Number(customTimers.short_break) * 60,
        long: Number(customTimers.long_break) * 60 
    }
    const bgColors = { 
        timer: '#b62525', 
        short: '#643A6B', 
        long: '#005B41' 
    }

    useEffect(() => {
        console.log(timer)
    },[timer])

    const handleTab = (tab) => {
        stopTimer()
        setActiveTab(tab)
        setTimer(defaultTimers[tab])
        setBg(bgColors[tab] || '#ffffff');
    }

    const startTimer = () => {
        if (!isTimerStart && list?.some(t => !t.checked)) {
            setIsTimerStart(true)
        }
    }

    const stopTimer = () => {
        if(clickAudio) clickAudio.play()
        if(intervalId) {
            clearInterval(intervalId)
            setIntervalId(null)
        }
        setIsTimerStart(false)
    }

    const resetTimer = () => {
        if(clickAudio) clickAudio.play()
        stopTimer()
        setTimer(defaultTimers[activeTab])
    }

    const notifyUser = (taskId) => {
        const updateTaskElement = list.find(t => t.id === taskId)

        if (window.confirm('Your rounds are over. Do you want to submit the task or continue?')) {
            const updateAttributes = {...updateTaskElement, checked: true, timer: formatTime(timer) }
            updateTask(taskId, updateAttributes, 'Task submitted', 'Error submitting task')
        } else {
            const updateAttributes = {...updateTaskElement, act: 1, timer: formatTime(timer) }
            updateTask(taskId, updateAttributes, 'Task rest', 'Error resetting task')
        }
    }

    const updateTask = async (id, updates, successMessage, errorMessage) => {
        try {
            const resp = await axios.put(
                `http://localhost:7000/api/updateTask/${id}`,
                updates,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if(resp.data) {
                setRoundsCompleted(0)
                setIsTimerStart(false)
                setIsTodo(prev => prev + 1)
                setMessage(successMessage)
            } else {
                setMessage(errorMessage)
            }
        } catch (err) {
            setMessage(`Exception error in updating task: ${err}`)
        } finally {
            setTimer(defaultTimers[activeTab]) // Reset timer for the next round
            startTimer()
        }
    }
    

    useEffect(() => {
        // check incomplete task that is first on list
        const firstIncompleteTask = list && list.find(t => !t.checked)
        const taskId = firstIncompleteTask ? firstIncompleteTask.id : null
        const actLimit = firstIncompleteTask ? firstIncompleteTask.act : 0

        if(firstIncompleteTask && isTimerStart && !intervalId) { // prevent multiple interval ids
            const id = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    // stop timer
                    stopTimer()
                    if(alarmAudio) alarmAudio.play()

                    // update rounds
                    const updatedRounds = roundsCompleted + 1
                    setRoundsCompleted(updatedRounds)

                    // notify user if rounds are complete
                    if (updatedRounds >= actLimit) {
                        notifyUser(taskId)
                    } else {
                        setTimer(defaultTimers[activeTab]) // Reset timer for the next round
                        startTimer()
                    }          
                    return defaultTimers[activeTab] // Prevent timer from going below 0
                }
                return prev - 1
            })}, 1000)
            setIntervalId(id)
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    },[isTimerStart, intervalId, roundsCompleted, activeTab])


  return (
    <div className='my-2 w-100 text-center'>
        {message && 
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>{message}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        }
        <nav id='timer-nav'> 
            <ul className='nav-pills timer-pill d-flex justify-content-center align-items-center' id='pills-tab' role='tablist'>
                  {['timer', 'short', 'long'].map((tab) => (
                      <li key={`${tab}`} className="nav-item rounded-pill py-1 px-md-4 px-0 me-3" role="presentation">
                          <Link
                              type="button"
                              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                              data-bs-toggle="pill"
                              role="tab"
                              aria-controls={`pills-${tab}`}
                              aria-selected={activeTab === tab}
                              onClick={() => handleTab(tab)}
                          >
                              {tab === 'timer' ? 'Timer' : tab === 'short' ? 'Short Break' : 'Long Break'}
                          </Link>
                      </li>
                  ))}
            </ul>
        </nav>

        <div className="tab-content m-2 text-white fw-semibold" id="pills-tabContent">
            {['timer', 'short', 'long'].map(tab => (
                <div 
                    key={`${tab}`}
                    className={`tab-pane fade ${activeTab === tab ? 'show active' : ''}`}
                    id={`pills-${tab}`} 
                    role="tabpanel" 
                    aria-labelledby={`pills-${tab}-tab`} 
                    tabIndex="0"
                >
                    {timer && formatTime(timer)}
                </div>
            ))}
        </div>

        <div className='text-center mt-3'>
            <button onClick={startTimer} className='btn text-white fs-4 fw-bold'>
                <i className="bi bi-play-circle"></i>
            </button>
            <button className='btn text-white fs-4 fw-bold' 
                onClick={stopTimer}>
                <i className="bi bi-stop-circle"></i>
            </button>
            <button onClick={resetTimer} className='btn fs-4 text-white fw-bold'>
                <i className="bi bi-arrow-counterclockwise"></i>
            </button>
        </div>
    </div>
   
  )
}

export default TimerNavigation