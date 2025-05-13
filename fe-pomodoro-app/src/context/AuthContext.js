import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import axiosCustomApi from '../axiosLib'

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [xCorrId, setXCorrId] = useState(() => {
        return sessionStorage.getItem('xCorrId') || null
    });
    
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if(token) {
            getUserVerification(token)
        } else {
            sessionStorage.removeItem('token') // remove token if invalid
        }
    },[])

    async function getUserVerification(token) {
        const result = await axiosCustomApi.get('/auth/verify-user', {
            headers: { Authorization: `Bearer ${token}`, }
        })
        console.log('user verified: ', result)    
        setUser(result)
    }

    
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

