import React from 'react'
import { useAuth } from '../context/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} replace/>
}

export default ProtectedRoutes
