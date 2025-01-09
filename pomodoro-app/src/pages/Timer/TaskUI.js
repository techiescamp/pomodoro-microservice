import React, { useState, useContext } from 'react'
import TaskForm from '../../components/Tasks/TaskForm';
import TaskList from '../../components/Tasks/TaskList';
import { MyContext } from './Timer';
import { UserContext } from '../../App';
import './Timer.css';

const TaskUI = () => {
    const { todo, setTodo } = useContext(MyContext);
    const { user, xCorrId } = useContext(UserContext);

    const [isUpdate, setIsUpdate] = useState(false);
    const [form, setForm] = useState({
        id: todo.length,
        title: '',
        description: '',
        project_title: '',
        act: 0,
        timer: 0,
        checked: false
    });

    const handleEdit = (id) => {
        setIsUpdate(true);
        let taskform = document.getElementById('taskform');
        taskform.style.display = 'block';
        const editData = todo.filter(t => t.id === id)
        if(editData) {
            setForm({
                ...form,
                id: editData[0].id,
                title: editData[0].title ? editData[0].title : '',
                project_title: editData[0].project_title ? editData[0].project_title : '',
                description: editData[0].description ? editData[0].description : '',
            })
        }
    }

    return (
        <>
            {/* Add task to UI */}
            <TaskList
                todo={todo}
                setTodo={setTodo}
                handleEdit={(id) => handleEdit(id)}
            />
            <TaskForm 
                todo={todo}
                setTodo={setTodo}
                user={user}
                xCorrId={xCorrId}
                form={form}
                setForm={setForm}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
            />
        </>
    )
}

export default TaskUI;