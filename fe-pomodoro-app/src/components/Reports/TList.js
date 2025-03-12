import React, { useEffect } from 'react'
import Report from './Report'
import { useTask } from '../../context/TaskContext'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import config from '../../config'

const apiUrl = config.apiUrl

const TList = () => {
    const { user } = useAuth()
    const { setList, list } = useTask()
    const token = sessionStorage.getItem('token')

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const resp = await axios.get(`${apiUrl}/api/getAllTasks`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setList(resp.data.userTasks)
            } catch (err) {
                console.error('Error fetching tasks ', err)
            }
        }
        if (user) { fetchTasks() }
    }, [user, token, setList])


  return (
    <>
        <div className='bg-report'>
            <Report />
        </div>

        <div id='tableList'>
            <h4 className='text-center text-decoration-underline my-4'>Focus Report</h4>
            <div className='w-75 mb-4 mx-auto text-center overflow-auto'>
                <table className='w-100'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Focus time</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list?.map(t => {
                            return (
                                <tr key={t.date}>
                                    <td>{new Date(t.date).toLocaleString()}</td>
                                    <td>
                                        <ul style={{listStyle: 'none', padding: 0}}>
                                            {t.tasks?.map(task => {
                                                return (
                                                    <li key={task.id}>{task.title || '-'}</li>
                                                )
                                            })}
                                        </ul>
                                    </td>
                                    <td>
                                        <ul style={{listStyle: 'none', padding: 0}}>
                                            {t.tasks?.map(task => {
                                                return (
                                                    <li key={task.id}>{task.act ? task.act * Number(task.timer) : 0}<span> min</span></li>
                                                )
                                            })}
                                        </ul>
                                    </td>
                                    
                                    <td>
                                        <ul style={{listStyle: 'none'}}>
                                            {t.tasks?.map(task => {
                                                return (
                                                    <li key={task.id}>{task.description || 'none'}</li>
                                                )
                                            })}
                                        </ul>
                                    </td>
                                </tr>
                            )
                        
                        })}
                    </tbody>
                </table>
            </div>
            
        </div>
    </>
  )
}

export default TList