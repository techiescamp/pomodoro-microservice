import React, { createContext, useContext, useState, useEffect } from 'react'

const TimerContext = createContext()

export const TimerContextProvider = ({ children }) => {
  const getCustomTimer = () => {
    try {
      const customTimer = JSON.parse(sessionStorage.getItem('customTimer'))
      return customTimer && customTimer.timer ? Number(customTimer.timer) * 60 : null
    } catch(err) {
      console.error('Invalid custom timer format', err)
      return null
    }
  }

  const [timer, setTimer] = useState(() => getCustomTimer() || 25 * 60)
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