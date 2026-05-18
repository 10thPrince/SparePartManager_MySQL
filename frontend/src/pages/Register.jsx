import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../axios/api'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const res = await api.post('/auth/register', { name, email, password })
            setSuccess(res.data?.message || 'Account created successfully')
            setName('')
            setEmail('')
            setPassword('')
            setTimeout(() => navigate('/login'), 800)
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-200 flex items-center justify-center px-4'>
            <div className='w-full max-w-md border border-gray-400 bg-white flex flex-col gap-y-8 rounded-2xl p-6 shadow-sm'>
                <div className='flex flex-col gap-y-2 px-3'>
                    <h1 className='text-2xl font-bold'>Create Account</h1>
                    <p className='text-md font-semibold text-gray-600'>Register to manage spare parts inventory.</p>
                </div>

                {error && (
                    <div className='border border-red-500 bg-red-200 text-red-800 text-center py-2 rounded-xl'>
                        {error}
                    </div>
                )}

                {success && (
                    <div className='border border-green-500 bg-green-100 text-green-800 text-center py-2 rounded-xl'>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='px-3 flex flex-col gap-y-4'>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor='name' className='font-semibold'>Full Name</label>
                        <input
                            id='name'
                            type='text'
                            name='name'
                            value={name}
                            placeholder='Enter your full name'
                            onChange={(e) => setName(e.target.value)}
                            className='border px-4 py-2 rounded-xl'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor='email' className='font-semibold'>Email</label>
                        <input
                            id='email'
                            type='email'
                            name='email'
                            value={email}
                            placeholder='example@company.com'
                            onChange={(e) => setEmail(e.target.value)}
                            className='border px-4 py-2 rounded-xl'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor='password' className='font-semibold'>Password</label>
                        <input
                            id='password'
                            type='password'
                            name='password'
                            value={password}
                            placeholder='Create a password'
                            onChange={(e) => setPassword(e.target.value)}
                            className='border px-4 py-2 rounded-xl'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-y-4'>
                        <button
                            type='submit'
                            className='bg-blue-500 w-full text-center py-2 rounded-xl text-white font-bold text-lg disabled:bg-blue-300'
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Register'}
                        </button>

                        <p className='text-sm text-center'>
                            Already have an account? <Link to='/login' className='underline text-blue-500'>Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
