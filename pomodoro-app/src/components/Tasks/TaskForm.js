import React, { useEffect } from 'react'
import { useTask } from '../../context/TaskContext'
import { useTimer } from '../../context/TimerContext'
import { useAuth } from '../../context/AuthContext'
import config from '../../config'
import axios from 'axios'

const apiUrl = config.apiUrl

const TaskForm = () => {
  const { todo, setTodo, setIsTodo, list, setList, setIsNoUserTodo, generateId, isEdit, setIsEdit, editData, setEditData } = useTask()
  const { timer } = useTimer()
  const { user } = useAuth()
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    if (isEdit) {
      let taskform = document.getElementById('taskform')
      taskform.style.display = 'block'
    }
  }, [isEdit])

  const handleChange = (e) => {
    setTodo({
      ...todo,
      [e.target.name]: e.target.value
    })
  }

  const handleEditInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const handleCancel = (e) => {
    e.preventDefault();
    let taskform = document.getElementById('taskform');
    let addBtn = document.getElementById('addBtn');
    addBtn.style.display = 'block';
    taskform.style.display = 'none';

    // If editing, reset edit mode without modifying the list
    if (isEdit) {
      setIsEdit(false);
      setEditData(null); // Reset editData
    } else {
      setTodo({
        id: generateId(),
        title: '',
        description: '',
        act: 1,
        timer: Number(timer),
        checked: false
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // guest user
      if(!user) { 
        setIsNoUserTodo(prev => prev+ 1)
        const isNoUserTodoExists = JSON.parse(sessionStorage.getItem('no_user_todo'))
        if(isNoUserTodoExists) { // yes
          const noUserTodos = [...isNoUserTodoExists, todo]
          sessionStorage.setItem('no_user_todo', JSON.stringify(noUserTodos))
        } else {
          sessionStorage.setItem('no_user_todo', JSON.stringify([todo]))
        }
      } 
      // if user exsits
      else { 
        const addTask = {
          userData: user,
          userTasks: {
            date: new Date().toLocaleDateString(),
            tasks: [todo]
          }
        }
        const resp = await axios.post(`${apiUrl}/api/addTask`, { addTask }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.data) setIsTodo(prev => prev + 1)
      }
    } catch(err) {
      console.error('Exception failure: ', err)
    }
    finally {
      setTodo({
        id: generateId(),
        title: '',
        description: '',
        act: 1,
        timer: Number(timer),
        checked: false
      })
    }
    
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      if(!user) {
        const taskList = JSON.parse(sessionStorage.getItem('no_user_todo'))
        const istaskExists = taskList.map(t => t.id === editData.id ? {...t, ...editData} : t)
        sessionStorage.setItem('no_user_todo', JSON.stringify(istaskExists))
        setIsNoUserTodo(prev => prev + 1)
        setEditData(null)
        setIsEdit(false)
      }
      else {
        const updatedTask = { ...editData }
        await axios.put(`${apiUrl}/api/editData/${editData.id}`,
          { updatedTask },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setList(list.map(task => task.id === editData.id ? { ...task, ...updatedTask } : task))
        setEditData(null)
        setIsEdit(false)
      }
    } catch (err) {
      console.error('Error in editing task ', err)
    }
  }


  return (
    <div className='bg-light text-dark p-3 mb-3 rounded-2' id='taskform'>
      <form id='formElement'>
        <input
          className='form-control bg-secondary-subtle mb-2'
          value={isEdit ? editData.title : todo.title || ''}
          name='title'
          onChange={isEdit ? handleEditInputChange : handleChange}
          placeholder='What are you working for?'
          required
        />
        <textarea
            className='form-control bg-secondary-subtle mb-2'
            name='description'
            placeholder='write your description or notes'
            value={isEdit ? editData.description : todo.description || ''}
            onChange={isEdit ? handleEditInputChange : handleChange}
          ></textarea>

        {/* add acts */}
        <div className='d-flex align-items-center'>
          <span className='me-2'>Act</span>
          <input 
            type='number'
            className='form-control w-25 me-2' 
            name='act'
            value={isEdit ? Number(editData.act) : Number(todo.act) || 0}
            placeholder={Number(0)}
            onChange={isEdit ? handleEditInputChange : handleChange}
          />
          <span className='fs-3 me-2'> / </span>
          <input 
            type='number' 
            className='form-control w-25 me-2' 
            name='act-1' 
            value={1} disabled 
          />
        </div>

        {/* cancel, submit button */}
        <div className='text-md-end mx-5 mt-3' id='task-btn'>
          <button 
            className='btn btn-light me-3' 
            onClick={handleCancel}
          >
              Cancel
          </button>
          <button 
            className='btn btn-dark' 
            type='submit' 
            onClick={isEdit ? handleUpdate : handleSubmit}
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm