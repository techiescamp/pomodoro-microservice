import React from 'react'
import { Link } from 'react-router-dom'
import './reports.css'
import { useAuth } from '../../context/AuthContext'
import './reports.css'

const Report = () => {
    const { user } = useAuth()


  return (
        <ul className='navbar nav p-md-2 justify-content-center flex-nowrap' id='timerNavigation'>
            <li className='nav-item'>
                <Link to={user && `/${user.displayName}/tasklist`} className='nav-link rounded-pill fw-medium py-1 px-5'>
                    Task List
                </Link>
            </li>

            <li className='nav-item'>
                <Link to={user && `/${user.displayName}/taskchart`} className='nav-link rounded-pill fw-medium py-1 px-5'>
                    Task Chart
                </Link>
            </li>
        </ul>
  )
}

export default Report