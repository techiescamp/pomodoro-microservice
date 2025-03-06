import React, { createContext, useContext, useEffect, useState } from 'react'
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


    return (
        <AuthContext.Provider value={{ user, setUser, xCorrId, setXCorrId, login }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)

