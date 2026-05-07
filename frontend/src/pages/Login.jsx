import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { api } from '../axios/api';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const  {login, isAuthenticated}  = useAuth();

    // useEffect(() => {
    //     isAuthenticated ? navigate('/dashboard') : ''
    // }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });
            login();
            alert(res.data?.message)
            navigate('/dashboard');
            console.log(res.data.message);
        }catch(err){
            setError(err.response?.data?.message || 
                'Invalid Email or password'
            )
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='min-h-screen bg-gray-200 flex items-center justify-center'>
            <div className='w-[50%] h-[50%] border border-gray-400 bg-white flex flex-col gap-y-10 rounded-2xl p-4'>
                <div className='flex flex-col gap-y-2 px-3'>
                    <h1 className='text-2xl font-bold'>
                        Login To Access
                    </h1>
                    <p className='text-md font-semibold text-gray-600'>
                        Welcome once again!
                    </p>
                </div>
                {error && <div className='border border-red-500 bg-red-200 text-red-800 text-center py-2 rounded-xl'>{error}</div>}
                <form onSubmit={handleSubmit} className='px-3 flex flex-col gap-y-4'>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input
                            type="email"
                            name='email'
                            placeholder='example@company.com'
                            onChange={(e) => setEmail(e.target.value)}
                            className='border px-4 py-2 rounded-xl'
                            required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        <input
                            type="password"
                            name='password'
                            placeholder='••••••••••'
                            onChange={(e) => { setPassword(e.target.value) }}
                            className='border px-4 py-2 rounded-xl'
                            required />
                    </div>
                    <div className='flex flex-col gap-y-4'>
                        <button 
                            type='submit' 
                            className='bg-blue-400 w-full text-center py-2 rounded-xl text-white font-bold text-lg'
                            disabled={loading}>
                            {loading? "Loading..." : "Submit"}
                        </button>

                        <p className='text-sm text-center'>
                            New Here? <a href="/register" className='underline text-blue-500'>Register</a>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Login