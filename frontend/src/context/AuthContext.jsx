import { useContext, useState } from "react";
import { createContext } from "react";
import { api } from "../axios/api";


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuth') === "true"
    )

    const login = () => {
        setIsAuthenticated(true)
        localStorage.setItem('isAuth', 'true')
    }

    const logout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem("isAuth")
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}