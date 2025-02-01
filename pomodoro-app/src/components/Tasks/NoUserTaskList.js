import React, { useEffect, useState } from 'react'
import { useTask } from '../../context/TaskContext'

const NoUserTaskList = () => {
    const { isNoUserTodo, roundsCompleted } = useTask()
    const { list, setList, isEdit, setIsEdit, setEditData } = useTask()

    
    useEffect(() => {
        const taskList = JSON.parse(sessionStorage.getItem('no_user_todo')) || null;
        setList(taskList)
    },[isNoUserTodo])

    const handleChecked = (id) => {
        if (!list) return;
        const task = list.map(t => t.id === id ? {...t, checked: !t.checked} : t)
        sessionStorage.setItem('no_user_todo', JSON.stringify(task))
        setList(task)
    }

    const handleEditTask = (id) => {
        const taskEdit = list.find(t => t.id === id)
        if(taskEdit) {
            setEditData(taskEdit)
            setIsEdit(true)
        }
    }

    const handleDeleteTask = (id) => {
        const taskList = list.filter(t => t.id === id)
        sessionStorage.setItem('no_user_todo', JSON.stringify(taskList))
        setList(taskList)
    }

    return (
        <ul id="tasklist-container" className='list-group'>
            {!isEdit && list && list.map(item => (
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

                            <span className='fw-bold' 
                                style={{'textDecoration': item.checked ? 'line-through' : 'none'}}
                            >
                                {item.title}
                            </span>
                        </div>
                        
                        <div className="badge text-bg-primary rounded-pill me-3">
                            {item.checked ? item.act : `${item.act}/${roundsCompleted}`}</div>

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

export default NoUserTaskList