import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../context/AuthContext';

const apiUrl = config.apiUrl;

const Login = () => {
    const { login, xCorrId } = useAuth()
    const navigate = useNavigate();

    const [status, setStatus] = useState(null);
    const [userLogin, setUserLogin] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setUserLogin({
            ...userLogin,
            [e.target.name]: e.target.value
        })
    }

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmailValidate = validateEmail(userLogin.email)
        if(!isEmailValidate) {
            alert("Provide valid email address")
            return;
        }
        const cid = xCorrId || `pomo-${Math.ceil(Math.random()*1000)}`;
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { userLogin }, {
                headers: { 'x-correlation-id': cid }
            })
            setStatus({message: response.data.message, statusCode: response.data.status})
            if(response.data.token) {
                login(response.data.user, response.data.token)
                navigate('/')
            }
        } catch(err) {
            console.error('Login failed')
            setStatus({ message: err.message, statusCode: 'warning' });    
        } finally {
            setUserLogin({
                email: '',
                password: ''
            });
        }
    }

    const inlineStyle = {
        borderRadius: '10px',
        padding: '5px'
    }


    return (
        <main className='main-container text-center'>
            <div className="form-container mx-auto pt-5">
                <div className='form-wrapper mx-auto border border-outline-secondary p-2 bg-light'>
                    <h3 className='m-3'>LOGIN FORM</h3>
                    {status ? 
                        <p style={inlineStyle} className={status.statusCode === 'success' ? 'text-success' : 'text-danger'}>
                            {status?.message}</p> 
                    : null
                    }

                    <form onSubmit={handleSubmit}>
                        <div className='w-75 mx-auto'>
                            <input
                                type='email'
                                name='email'
                                value={userLogin.email}
                                onChange={handleChange}
                                autoComplete='email'
                                className='form-control mb-3 border border-secondary rounded-1'
                                placeholder='Enter your email'
                                required
                            />
                            <input
                                type='password'
                                name='password'
                                value={userLogin.password}
                                onChange={handleChange}
                                className='form-control mb-3 border border-secondary rounded-1'
                                placeholder='Enter your password'
                                autoComplete="current-password"
                                required
                            />
                            <button className='btn btn-primary w-100'>Continue</button>
                        </div>
                    </form>
                    
                    <p className='m-3'>Can't Login ? <Link to='/signup'>Create Account</Link></p>
                    <hr className='w-50 mx-auto' />
                    <div>
                        <h4 className='mb-3 text-danger fw-bold'>Pomodoro</h4>
                        <p className='small'>Privacy Policy <span>.</span> User Notice</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login