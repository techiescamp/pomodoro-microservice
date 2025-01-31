import React, { useState } from 'react'
import './settings.css'


const GuestSettings = () => {
    const [customTime, setCustomTime] = useState({
        timer: 25,
        short_break: 5,
        long_break: 15
    })
    const [msg, setMsg] = useState('')
    const [isNotify, setIsNotify] = useState(false)

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
        <div className='container my-5 py-3'>
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

export default GuestSettings