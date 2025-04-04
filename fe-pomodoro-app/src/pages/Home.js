import React, { useState, useEffect } from 'react';
import Pomodoro from '../components/Pomodoro/Pomodoro'
import PomodoroContent from '../components/Pomodoro/PomodoroContent';
import config from '../config';

const start = performance.now();
let loadTime = 0;
const metrics_url = config.metrics_url;

const Home = () => {
    const [errCount, setErrCount] = useState(0);

    useEffect(() => {
        window.addEventListener('error', () => {
            setErrCount(prev => prev + 1);
        });
        const sendLoadTimeToBackend = async () => {
        try {
            const end = performance.now();
            loadTime = end - start;
            await fetch(`${metrics_url}`, {
                method: 'POST',
                body: JSON.stringify({ app_time: loadTime, errorCount: errCount }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            return;
        }
        };
        sendLoadTimeToBackend();
    },[errCount]);

     
    return (
        <div>
            <Pomodoro />
            <PomodoroContent />
        </div>
    )
}

export default Home