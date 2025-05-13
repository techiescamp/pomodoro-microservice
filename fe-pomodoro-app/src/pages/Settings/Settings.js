import React, { useState } from 'react';
import './settings.css';
import { useAuth } from '../../context/AuthContext';
import axiosCustomApi from '../../axiosLib';

const Settings = () => {
    const { user, setUser, xCorrId } = useAuth()
    const token = sessionStorage.getItem('token')

    const [profile, setProfile] = useState({
        displayName: (user && user.displayName) || '',
        email: (user && user.email) || '',
        password: '',
        msg: ''
    })
    const [customTime, setCustomTime] = useState({
        timer: 25,
        short_break: 5,
        long_break: 15
    })
    const [msg, setMsg] = useState('')
    const [isNotify, setIsNotify] = useState(false)

    const handleProfile = (e) => {
        setProfile({...profile, [e.target.name]: e.target.value})
    }

    const handleForm = async (e) => {
        e.preventDefault();

        if(profile.password !== '') {
            const confirm = window.confirm('Are you sure you want to change your password?');
            if (!confirm) return;
        }
        const resp = await axiosCustomApi.post(`/auth/update-user`, 
            { profile },
            { headers: { 
                Authorization: `Bearer ${token}`,
                'x-correlation-id': xCorrId, 
            }},
        )
        if(resp.data) {
            setUser(resp.data.result)
            setProfile({
                displayName: resp.data.result.displayName,
                email: resp.data.result.email,
                password: '',
                msg: resp.data.message
            })
            closeBtn();
        }
    }

    const handleTimer = (e) => {
        setCustomTime({
            ...customTime, 
            [e.target.name]: e.target.value
        })
    }

    const handleTimerForm = (e) => {
        e.preventDefault()
        sessionStorage.setItem('customTimer', JSON.stringify(customTime));
        setMsg("Updated timer successfully")
        // // Dispatch a custom event to notify TimerContext
        const event = new Event('custom_time_updated');
        window.dispatchEvent(event);
        closeBtn()
    }

    function closeBtn() {
        setIsNotify(true);
        setTimeout(() => {
            setIsNotify(false)
        },2000)
    }


    return (
        <div className='settings-container container my-5 py-3'>
            <div className='border border-2 rounded-3 p-3 mb-3'>
                <h5 className='font-bold mb-4'>Change Profile</h5>

                {profile.msg ? 
                <p className='close bg-success-subtle p-2 text-success rounded-3 d-flex justify-content-between'>
                    {profile.msg} 
                    <button className='me-5' onClick={closeBtn}>x</button>
                </p>
                : null}

                <form onSubmit={handleForm}>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Username</span>
                        <input type="text" className="form-control" value={profile.displayName} name='displayName' onChange={handleProfile} />
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text">Email</span>
                        <input type="email" className="form-control" value={profile.email} disabled/>
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text">Change Password</span>
                        <input type="password" className="form-control" value={profile.password} name='password' onChange={handleProfile} />
                    </div>
                    <button className='btn btn-success'>Save Profile</button>
                </form>
            </div>

            {/* timer */}
            <div className='border border-2 rounded-3 p-3 mb-3'>
                <h5 className='mb-4'>Customize Timer</h5>

                {isNotify && msg ? 
                <p className={`notification ${isNotify ? 'visible' : 'hidden'} bg-success-subtle p-2 text-success font-semibold rounded-3 d-flex justify-content-between`}>
                    {msg} 
                </p>
                : null}

                <form onSubmit={handleTimerForm}>
                    <div className="d-flex align-items-center mb-3 w-md-75">
                        <span className="input-group-text me-3">Timer</span>
                        <input type="number" className="form-control me-3 w-25" value={customTime.timer} name='timer' onChange={handleTimer} />
                        <span>Min</span>
                    </div>
                    <div className="d-flex align-items-center mb-3 w-md-75">
                        <span className="input-group-text me-3">Short Break</span>
                        <input type="number" className="form-control me-3 w-25" value={customTime.short_break} name='short_break' onChange={handleTimer} />
                        <span>Min</span>
                    </div>
                    <div className="d-flex align-items-center mb-3 w-md-75">
                        <span className="input-group-text me-3">Long Break</span>
                        <input type="number" className="form-control me-3 w-25" value={customTime.long_break} name='long_break' onChange={handleTimer} />
                        <span>Min</span>
                    </div>
                    <button className='btn btn-success'>Save Changes</button>
                </form>
                
            </div>
        </div>
    )
}

export default Settings;