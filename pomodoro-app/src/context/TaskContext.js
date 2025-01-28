import React, { useState, useEffect, createContext, useContext } from 'react'
import { useTimer } from './TimerContext'

const TaskContext = createContext()

export const TaskContextProvider = ({ children }) => {
    const { timer } = useTimer()

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60
        const timeFormat = `${String(minutes)}:${String(seconds).padStart(2, '0')}`
        return timeFormat
    }  

    const [todo, setTodo] = useState({
        id: generateId(),
        title: '',
        description: '',
        act: 1,
        timer: formatTime(Number(timer)),
        checked: false
    })
    const [list, setList] = useState([])
    const [isTodo, setIsTodo] = useState(0)
    const [isEdit, setIsEdit] = useState(false)
    //
    const [editData, setEditData] = useState(null)


    function generateId() {
        const pdate = new Date().toDateString().split(' ')[3]
        const random_num = Math.floor(Math.random() * 1000)
        const genId = `TID${pdate + random_num}`
        return genId
    }

    useEffect(() => {
        setTodo((prev) => ({
          ...prev,
          timer: Number(formatTime(timer)),
        }));
    }, [timer]);

    const clearTasks = () => {
        setList([])
        setIsTodo(false)
    }

        
    return (
        <TaskContext.Provider value={{todo, setTodo, list, setList, isTodo, setIsTodo, generateId, clearTasks, isEdit, setIsEdit, editData, setEditData}}>
            {children}
        </TaskContext.Provider>
    )
}

export const useTask = () => useContext(TaskContext)