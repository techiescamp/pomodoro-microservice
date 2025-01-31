import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import { useTask } from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom'


function Header() {
  const { user, setUser } = useAuth()
  const { setIsTodo, clearTasks } = useTask()

  const navigate = useNavigate()
  
  const logout = () => {
    if (user) {
      setIsTodo(0);
      sessionStorage.clear()
      setUser(null); // Properly updates the user state
      clearTasks();
      navigate('/');
    } else {
      console.error('setUser is not defined');
    }
  }


  return (
    <header>
      <nav className="navbar navbar-expand-lg" style={{color: '#DDE6ED'}}>
        <div className="container-fluid align-items-center justify-content-center justify-content-between">
          <Link className="navbar-brand ms-5" to="/">Pomodoro</Link>
          
          {/* toggle button  on mobile and ipad version */}
          <button className="navbar-toggler focus-ring" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="menu-icon"><i className="bi bi-list"></i></span>
          </button>

          {/* toggle list */}
          <div className="collapse navbar-collapse align-items-center justify-content-end" id="navbarNav">
            {user ?
              <ul className='navbar-nav me-lg-5 mb-lg-0'>
                <li className='nav-item me-lg-4 mb-1 mb-lg-0 dropdown'>
                  {/* avtar toggle button */}
                  <button className='px-3 py-1 mx-auto rounded-pill border border-info-subtle d-flex align-items-md-center dropdown-toggle' type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="avatar me-2">
                    {(user?.displayName && user.displayName[0]) || 
                      (user?.name && user.name[0]) || 
                    ''}
                    </span>
                    {(user?.displayName && user.displayName) || 
                      (user?.name && user.name) || 
                    ''}
                  </button>

                  <ul className='dropdown-menu'>
                    <li className='dropdown-header mb-1 border border-bottom-1'>
                      <Link to='/' className="text-decoration-none text-secondary">
                        {/* <p className='mb-0'>{user.displayName}</p> */}
                        <p className='mb-0'>#{user.email}</p>
                      </Link>
                    </li>
                    <li className='dropdown-item mb-1 py-2'>
                      <Link to={`/${user.displayName}/settings`} className="text-decoration-none text-black">
                        <i className="bi bi-person-circle me-3"></i>Settings
                      </Link>
                    </li>
                    <li className='dropdown-item mb-1 py-2' onClick={logout}>
                      <i className="bi bi-box-arrow-right me-3"></i>Logout
                    </li>
                  </ul>
                </li> 
              </ul>
            : (
            <ul className="navbar-nav justify-content-lg-end">
              <li className="nav-item mx-auto me-lg-4 mb-2 mb-lg-0">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item mx-auto me-lg-4 mb-2 mb-lg-0">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
              <li className="nav-item mx-auto me-lg-4 mb-2 mb-lg-0">
                <Link className="nav-link" to="/guest/settings">Settings</Link>
              </li>
            </ul>)
          }

          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
