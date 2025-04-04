import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import config from '../config';
import axios from 'axios'

const apiUrl = config.apiUrl;

const Signup = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [register, setRegister] = useState({
        displayName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setRegister({
            ...register,
            [e.target.name]: e.target.value
        })
    }

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmailValidate = validateEmail(register.email)
        if(!isEmailValidate) {
            alert("Provide valid email address")
            return;
        }
        const cid = `pomo-${Math.ceil(Math.random()*200)}`;
        try {
            const response = await axios.post(`${apiUrl}/auth/signup`, { register }, {
                headers: { 'x-correlation-id': cid }
            })
            setStatus({message: response.data.message, statusCode: response.data.status})
            navigate('/login')
        } catch(err) {
            setStatus({message: `signup failed ${err.message}`, statusCode: 'error'})
        } finally {
            setRegister({
                displayName: '',
                email: '',
                password: ''
            });
        }
    }

    const inlineStyle = {
        color: getColor(),
        borderRadius: '10px',
        padding: '5px'
    }
    function getColor() {
        if (status?.statusCode === 'success') {
            return 'green'
        } else {
            return 'red'
        }
    }

    return (
        <main className='main-container text-center'>
            <div className="form-container mx-auto pt-5">
                <div className='form-wrapper mx-auto border border-outline-secondary p-2 bg-light'>
                    <h3 className='m-3'>SIGN UP FORM</h3>
                    {status && <p style={inlineStyle}>{status?.message} !</p>}

                    <form onSubmit={handleSubmit}>
                        <div className='w-75 mx-auto'>
                            <input
                                type='text'
                                name='displayName'
                                value={register.displayName}
                                onChange={handleChange}
                                className='form-control mb-3 border border-secondary rounded-1'
                                placeholder='Your Full name'
                                required
                            />
                            <input
                                type='email'
                                name='email'
                                value={register.email}
                                onChange={handleChange}
                                className='form-control mb-3 border border-secondary rounded-1'
                                placeholder='Enter your email'
                                required
                            />
                            <input
                                type='password'
                                name='password'
                                value={register.password}
                                onChange={handleChange}
                                className='form-control mb-3 border border-secondary rounded-1'
                                placeholder='Enter your password'
                                required
                            />
                            <p className='text-start' style={{ fontSize: '12px' }}>
                                By signing up, I accept the PomodoroApp <Link to='/termsConditions'>Terms of Service </Link>
                                and acknowledge the <Link to='/privacyPolicy'>Privacy Policy.</Link>
                            </p>
                            <button className='btn btn-primary w-100'>Sign up</button>
                        </div>
                    </form>

                    <p className='m-3'>Already have an account ? <Link to='/login'>Login here</Link></p>

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

export default Signup