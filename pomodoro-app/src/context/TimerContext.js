import React, { createContext, useContext, useState, useEffect } from 'react'

const TimerContext = createContext()

export const TimerContextProvider = ({ children }) => {
  const getCustomTimer = () => {
    try {
      const customTimer = JSON.parse(sessionStorage.getItem('customTimer'));
      return customTimer || {
        timer: 25,
        short_break: 5,
        long_break: 15
      };
    } catch (err) {
      console.error('Invalid custom timer format', err);
      return {
        timer: 25,
        short_break: 5,
        long_break: 15
      };
    }
  };

  const customTimers = getCustomTimer()

  const [timer, setTimer] = useState(customTimers.timer * 60)
  const [bg, setBg] = useState('#b62525')


  // Sync `timer` state with changes to `custom_time` in sessionStorage
  useEffect(() => {
    const handleCustomTimeUpdate = () => {
        const custom_time = JSON.parse(sessionStorage.getItem('customTimer')) || false;
        if (custom_time) {
            setTimer(Number(custom_time.timer) * 60);
        }
    };

    // Listen for a custom event
    window.addEventListener('custom_time_updated', handleCustomTimeUpdate);

    return () => {
      // Cleanup the event listener
      window.removeEventListener('custom_time_updated', handleCustomTimeUpdate);
    };
  }, []);

  return (
    <TimerContext.Provider value={{ timer, setTimer, bg, setBg }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = () => useContext(TimerContext)