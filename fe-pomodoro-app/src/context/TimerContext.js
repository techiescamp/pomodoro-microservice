import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types';

const TimerContext = createContext()

export const TimerContextProvider = ({ children }) => {
  const getCustomTimer = () => {
    const customTimer = JSON.parse(sessionStorage.getItem('customTimer')) || false;
    return customTimer || {
        timer: 25,
        short_break: 5,
        long_break: 15
      };
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

  const contextValue = useMemo(() => ({ timer, setTimer, bg, setBg }), [timer, bg]);

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  )
}
TimerContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTimer = () => useContext(TimerContext)