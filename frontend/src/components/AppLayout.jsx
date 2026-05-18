import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { api } from '../axios/api'
import { useAuth } from '../context/useAuth'

const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/sparepart', label: 'Spare Parts' },
    { to: '/spareIn', label: 'Stock In' },
    { to: '/spareOut', label: 'Stock Out' },
]

const AppLayout = ({ title, subtitle, children }) => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout')
        } finally {
            logout()
            navigate('/login')
        }
    }

    return (
        <div className='min-h-screen bg-gray-100 text-gray-900'>
            <header className='border-b border-gray-300 bg-white'>
                <div className='mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold'>{title}</h1>
                        {subtitle && (
                            <p className='text-sm font-medium text-gray-600'>{subtitle}</p>
                        )}
                    </div>

                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                        <nav className='flex flex-wrap gap-2'>
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `rounded-lg px-3 py-2 text-sm font-semibold ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 bg-white text-gray-700'
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>

                        <button
                            type='button'
                            onClick={handleLogout}
                            className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white'
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className='mx-auto max-w-7xl px-4 py-6 flex flex-col gap-6'>
                {children}
            </main>
        </div>
    )
}

export default AppLayout
