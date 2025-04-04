import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './document.css'
import Sidebar from './Sidebar'


const Document = () => {  
    const [iconClick, setIconClick] = useState(false)

    function handleIcon() {
        setIconClick(!iconClick)
    }

    useEffect(() => {
        const sidebar = document.getElementById('sidebar')
        if(window.innerWidth <= 768) {
            sidebar.style.display = iconClick ? 'block' : 'none'
        } else {
            sidebar.style.display = 'block'
        }
    },[iconClick])

    return (
        <div className='doc-container'>
            <button id='side-icon' onClick={handleIcon}>
                <i className="bi bi-box-arrow-up-right"></i>
            </button>

            <div id='sidebar' className={iconClick ? 'active' : ''}>
                <Sidebar />
            </div>
            
            <div id='main-content'>
                <Outlet /> 
                {/* render nested doc content here */}
            </div>
        </div>
    )
}

export default Document