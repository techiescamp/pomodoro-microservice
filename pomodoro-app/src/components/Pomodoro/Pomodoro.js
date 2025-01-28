import React from 'react'
import TimerNavigation from '../Timer/TimerNavigation'
import { useTimer } from '../../context/TimerContext'
import './pomodoro.css'
import TaskList from '../Tasks/TaskList'
import TaskForm from '../Tasks/TaskForm'
import Report from '../Reports/Report'

const Pomodoro = () => {
    const { bg } = useTimer()

    const handleAddTask = () => {
        let taskform = document.getElementById('taskform');
        let addBtn = document.getElementById('addBtn');
        let formElement = document.getElementById('formElement');
        taskform.style.display = 'block';
        formElement.style.display = 'block';
        addBtn.style.display = 'none';
    }


  return (
    <>
        {/* <div id='timer' style={{ backgroundColor: bg }}> */}
        <main className='container-fluid pt-0 pb-5 m-0 timer-container position-relative' style={{ backgroundColor: bg }}>
            <Report />

            <div className='container mx-auto timerApp'>
                <TimerNavigation />
                <hr className='w-75 mx-auto text-white' />

                <TaskList />
                <TaskForm />

                {/* Add task Button */}
                <button className='btn px-5 py-2 my-4 mx-auto text-white fw-bold' id='addBtn' onClick={handleAddTask}>
                    Add Tasks
                </button>
            </div>

        </main>
    </>
  )
}

export default Pomodoro