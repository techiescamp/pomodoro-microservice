import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <main className='container-fluid p-0 m-0 main-container'>
        <div className="container pt-5">
            <div className='card p-3 w-75 mx-auto'>
              <h3 className='text-secondary my-3'>
                Error 404: Page Not Found! This isn't the page you were looking for, but here are some links that might help you:
              </h3>
              <ul>
                <li className='mb-3 fs-5'>
                  <Link to='/'>Home</Link>
                </li>
                <li className='mb-3 fs-5'>
                  <Link to='/login'>Login</Link>
                </li>
                <li className='mb-3 fs-5'>
                  <Link to='/signup'>Signup</Link>  
                </li>
              </ul>
            </div>
        </div>
    </main>
  )
}

export default ErrorPage