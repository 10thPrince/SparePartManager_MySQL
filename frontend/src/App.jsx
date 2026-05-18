import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoutes from './components/ProtectedRoutes'
import Register from './pages/Register'
import SparePart from './pages/SparePart'
import SpareIn from './pages/SpareIn'
import SpareOut from './pages/SpareOut'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/' element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/sparepart' element={<SparePart />} />
          <Route path='/spareparts' element={<Navigate to='/sparepart' replace />} />
          <Route path='/spareIn' element={<SpareIn />} />
          <Route path='/spareOut' element={<SpareOut />} />
          <Route path='/stockOut' element={<Navigate to='/spareOut' replace />} />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App
