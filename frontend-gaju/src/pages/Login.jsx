import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {api}  from '../api/axios.js'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async(e) => {
        e.preventDefault();

        setError('');
        setLoading(true);
        try{
            const res = await api.post('/auth/login', {email, password});
            login();
            alert('login successfully');
            navigate('/dashboard')
        }catch(err){
            console.log(err);
            setError(
                err.response?.data?.message ||
                "Incorect Email or Passworddddd"
            )
        }finally{
            setLoading(false)
        }
    }



    return (
        <div className='min-h-screen bg-gray-300 flex items-center justify-center'>
            <div className='h-[50%] w-[50%] bg-white flex flex-col gap-y-5 p-4 border-2 border-gray-600 rounded-2xl'>
                <div className='px-5'>
                    <h1 className='text-2xl font-bold text-center'>Login to get Access</h1>
                    <p className='text-gray-800 font-semibold text-center'>Welcome Again!</p>
                </div>
                {error && <div className='mx-5 border border-red-600 bg-red-200 text-red-900 py-2 text-center rounded-lg'>{error}</div>}
                <form onSubmit={submitHandler} className='px-5 flex flex-col gap-y-5'>
                    <div className='flex flex-col  gap-y-2'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input
                            type="email"
                            name='email'
                            placeholder='example@gmail.com'
                            className='border border-gray-600 px-4 py-2 rounded-lg'
                            onChange={(e) => { setEmail(e.target.value) }}
                            required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        <input
                            type="password"
                            name='password'
                            placeholder='••••••••••'
                            onChange={(e) => setPassword(e.target.value)}
                            className='border border-gray-600 px-4 py-2 rounded-lg'
                            required />
                    </div>
                    <div className='flex flex-col justify-center'>
                        <button type='submit' className='bg-blue-400 mx-auto w-[60%] py-2 text-white font-bold text-lg rounded-lg '>
                            {loading ? 'Loading...' : 'Submit'}
                        </button>
                        <p className='text-center'>Don't have An Account? <Link to={'/signup'} className='underline text-blue-500'>Register</Link></p>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Login

