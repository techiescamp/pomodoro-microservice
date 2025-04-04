import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import config from '../config'

const AuthContext = createContext()
const apiUrl = config.apiUrl

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [xCorrId, setXCorrId] = useState(() => {
        return sessionStorage.getItem('xCorrId') || null
    });
    
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if(token) {
            fetch(`${apiUrl}/auth/verify-user`, { 
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}`, }
                }
            )
            .then(res => res.json())
            .then(result => {
                setUser(result)
            })
            .catch(() => sessionStorage.removeItem('token')) // remove token if invalid
        }
    },[])

    
    const login = (userData, token) => {
        setUser(userData)
        sessionStorage.setItem('token', token)
    }


    const contextValue = useMemo(() => ({ user, setUser, xCorrId, setXCorrId, login }), [user, xCorrId])
    AuthProvider.propTypes = {
        children: PropTypes.node.isRequired,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)

