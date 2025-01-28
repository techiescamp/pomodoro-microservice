import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useTask } from '../../context/TaskContext'
import './task.css'

const TaskList = () => {
    const { user } = useAuth()
    const { list, setList, isTodo, setIsTodo, isEdit, setIsEdit, setEditData } = useTask()
    const token = sessionStorage.getItem('token')

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const resp = await axios.get('http://localhost:7000/api/getTasks', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setList(resp.data)
            } catch (err) {
                console.error('Error fetching tasks ', err)
            }
        }
        if (user) { fetchTasks() }
    }, [user, isTodo])

    const handleChecked = async (id) => {
        // update backend
        try {
            const task = list.find(t => t.id === id)
            const resp = await axios.put(`http://localhost:7000/api/updateTask/${id}`,
                {
                    checked: !task.checked,
                    act: task.act || 1
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if(resp.data) setIsTodo(true)
        } catch (err) {
            console.error('Error updating task: ', err)
        }
    }

    const handleEditTask = (id) => {
        const taskEdit = list.find(t => t.id === id)
        if (taskEdit) {
            setEditData(taskEdit)
            setIsEdit(true)
        }

    }

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:7000/api/deleteTask/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setList(list.filter(t => t.id !== id))
        } catch (err) {
            console.error('Error deleting task: ', err)
        }
    }

    
    return (
        <ul id="tasklist-container" className='list-group'>
            {!isEdit && list.map(item => (
                    <li
                        id={`tasklist-${item.id}`}
                        className="list-group-item d-flex justify-content-between align-items-start"
                        key={item.id}
                    >
                        <div className='ms-2 me-auto'>
                            <input
                                type="checkbox"
                                className="border border-secondary me-2"
                                checked={item.checked}
                                disabled={item.checked}
                                onChange={() => handleChecked(item.id)}
                            />

                            <span className='fw-bold'>{item.title}</span>
                        </div>
                        
                        <div className="badge text-bg-primary rounded-pill me-3">{item.act}</div>

                        <div className="dropdown dots">
                            <button
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                ...
                            </button>
                            <ul className="dropdown-menu">
                                <li className="dropdown-item" onClick={() => handleEditTask(item.id)}>
                                    Edit
                                </li>
                                <li className="dropdown-item" onClick={() => handleDeleteTask(item.id)}>
                                    Delete
                                </li>
                            </ul>
                        </div>
                    </li>
                ))
            }
        </ul>
        )
}

export default TaskList