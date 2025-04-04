import React, { useState, useEffect, createContext, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTimer } from './TimerContext'

const TaskContext = createContext()

export const TaskContextProvider = ({ children }) => {
    const { timer } = useTimer()

    const [todo, setTodo] = useState({
        id: generateId(),
        title: '',
        description: '',
        act: 1,
        timer: Number(timer),
        checked: false
    })
    const [list, setList] = useState([])
    const [isTodo, setIsTodo] = useState(0)
    const [isEdit, setIsEdit] = useState(false)
    const [isNoUserTodo, setIsNoUserTodo] = useState(0)
    const [roundsCompleted, setRoundsCompleted] = useState(0)    
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
          timer: Number(Math.floor(timer/60)),
        }));
    }, [timer]);

    const clearTasks = () => {
        setList([])
        setIsTodo(false)
    }

        
    const contextValue = useMemo(() => ({
        todo, setTodo, 
        list, setList, 
        isTodo, setIsTodo, 
        isNoUserTodo, setIsNoUserTodo,
        isEdit, setIsEdit, 
        editData, setEditData,
        roundsCompleted, setRoundsCompleted,
        generateId, 
        clearTasks, 
    }), [todo, list, isTodo, isNoUserTodo, isEdit, editData, roundsCompleted]);

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    )
}
TaskContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const useTask = () => useContext(TaskContext)
