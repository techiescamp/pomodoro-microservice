import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [xCorrId, setXCorrId] = useState(() => {
        return sessionStorage.getItem('xCorrId') || null
    });
    
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if(token) {
            fetch('http://localhost:7000/auth/verify-user', { 
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

    // useEffect(() => {
    //     if (user) {
    //         setXCorrId(user.xCorrId);
    //     }
    // }, [user])

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

