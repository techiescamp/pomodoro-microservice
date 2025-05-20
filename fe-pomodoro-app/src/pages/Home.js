import React, { useState, useEffect } from 'react';
import Pomodoro from '../components/Pomodoro/Pomodoro'
import PomodoroContent from '../components/Pomodoro/PomodoroContent';
import axiosCustomApi from '../axiosLib';

const start = performance.now();
let loadTime = 0;

const Home = () => {
    const [errCount, setErrCount] = useState(0);

    useEffect(() => {
        window.addEventListener('error', () => {
            setErrCount(prev => prev + 1);
        });
        const sendLoadTimeToBackend = async () => {
        const end = performance.now();
        loadTime = end - start;
        await axiosCustomApi.post('/metrics', {
            app_time: loadTime,
            errorCount: errCount
        }).then((response) => {
            console.log('Metrics sent successfully:', response.data);
        }).catch((error) => {
            console.error('Error sending metrics:', error);
        })
        };
        sendLoadTimeToBackend();
    }, [errCount]);

     
    return (
        <div>
            <Pomodoro />
            <PomodoroContent />
        </div>
    )
}

export default Home