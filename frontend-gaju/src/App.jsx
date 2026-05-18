import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoutes from './components/ProtectedRoutes'

const App = () => {
  return (
    <>
      <Routes>
        {/* <Route index element={}/> */}
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />

        </Route>

      </Routes>
    </>
  )
}

export default App