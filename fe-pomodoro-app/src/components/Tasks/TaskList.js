import React, { useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useTask } from '../../context/TaskContext'
import config from '../../config'
import './task.css'


const apiUrl = config.apiUrl

const TaskList = () => {
    const { user } = useAuth()
    const { list, setList, isTodo, setIsTodo, isEdit, setIsEdit, setEditData, roundsCompleted } = useTask()
    const token = sessionStorage.getItem('token')

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const resp = await axios.get(`${apiUrl}/api/getTasks`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setList(resp.data)
            } catch (err) {
                console.error('Error fetching tasks ', err)
            }
        }
        if (user) { fetchTasks() }
    }, [user, token, setList, isTodo])

    const handleChecked = async (id) => {
        // update backend
        try {
            const task = list.find(t => t.id === id)
            const resp = await axios.put(`${apiUrl}/api/updateTask/${id}`,
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
            await axios.delete(`${apiUrl}/api/deleteTask/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setList(list.filter(t => t.id !== id))
        } catch (err) {
            console.error('Error deleting task: ', err)
        }
    }

    
    return (
        <ul id="tasklist-container" className='list-group'>
            {!isEdit && list?.map(item => (
                    <li
                        id={`tasklist-${item.id}`}
                        className="list-group-item d-flex justify-content-between align-items-start"
                        key={`tasklist-${item.id}`}
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
                        
                        <div className="badge text-bg-primary rounded-pill me-3">{item.act}/{roundsCompleted}</div>

                        <div className="dropdown dots">
                            <button
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                ...
                            </button>
                            <div className="dropdown-menu">
                                <button className="dropdown-item" onClick={() => handleEditTask(item.id)}>
                                    Edit
                                </button>
                                <button className="dropdown-item" onClick={() => handleDeleteTask(item.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))
            }
        </ul>
        )
}

export default TaskList