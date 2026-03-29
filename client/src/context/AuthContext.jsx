// this will store logged-in user
// store token
// provide login function
// provide logout function

import { createContext, useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => { 
    const [user,setUser] = useState(null)     // will store log in user 
    const [token,setToken] = useState(localStorage.getItem("token"))

    const navigate = useNavigate()

    // load user from local storage when website refreshes
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if(storedUser) {
            setUser(JSON.parse(storedUser))
        }
    },[])

    // login function 
    const login = async (email, password) => {
        try {
            const data = await apiRequest("/auth/login", "POST", {
                email,
                password
            })

            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            setToken(data.token)
            setUser(data.user)
        } catch(error) {
            alert(error.message)
        }
    }
    
    // logout function 
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        navigate("/login")

        setToken(null)
        setUser(null)
    }
        
    return (
        // makes user availabe everywhere
        <AuthContext.Provider value={{ user, token, login, logout }}>  
            {children}
        </AuthContext.Provider>
    )
}