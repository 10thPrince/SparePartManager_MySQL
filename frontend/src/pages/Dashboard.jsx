import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../axios/api'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/useAuth'

const toDateInputValue = (date) => {
    if (!date) {
        return ''
    }

    return String(date).slice(0, 10)
}

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [spares, setSpares] = useState([])
    const [stockIns, setStockIns] = useState([])
    const [stockOuts, setStockOuts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { logout } = useAuth()
    const navigate = useNavigate()

    const spareById = useMemo(() => {
        return spares.reduce((map, spare) => {
            map[spare.SparePartId] = spare
            return map
        }, {})
    }, [spares])

    const totals = useMemo(() => {
        return spares.reduce(
            (summary, spare) => {
                const quantity = Number(spare.Quantity || 0)
                const price = Number(spare.UnitPrice || 0)

                return {
                    quantity: summary.quantity + quantity,
                    value: summary.value + quantity * price,
                }
            },
            { quantity: 0, value: 0 }
        )
    }, [spares])

    const latestStockIns = useMemo(() => {
        return [...stockIns]
            .sort((a, b) => Number(b.StockInId || 0) - Number(a.StockInId || 0))
            .slice(0, 5)
    }, [stockIns])

    const latestStockOuts = useMemo(() => {
        return [...stockOuts]
            .sort((a, b) => Number(b.StockOutId || 0) - Number(a.StockOutId || 0))
            .slice(0, 5)
    }, [stockOuts])

    const loadDashboard = useCallback(async () => {
        try {
            const [meRes, sparesRes, stockInsRes, stockOutsRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/spareparts'),
                api.get('/spareIn'),
                api.get('/spareOut'),
            ])

            setUser(meRes.data?.data?.[0] || null)
            setSpares(sparesRes.data?.data || [])
            setStockIns(stockInsRes.data?.data || [])
            setStockOuts(stockOutsRes.data?.data || [])
            setError('')
        } catch (err) {
            if (err.response?.status === 401) {
                logout()
                navigate('/login')
                return
            }

            setError(err.response?.data?.message || 'Unable to load dashboard data')
        } finally {
            setLoading(false)
        }
    }, [logout, navigate])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadDashboard()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [loadDashboard])

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
                <div className='text-lg font-semibold text-gray-700'>Loading dashboard...</div>
            </div>
        )
    }

    return (
        <AppLayout
            title='Inventory Dashboard'
            subtitle={user ? `Signed in as ${user.UserName}` : 'Spare parts overview'}
        >
            {error && (
                <div className='rounded-lg border border-red-500 bg-red-100 px-4 py-3 text-sm font-semibold text-red-800'>
                    {error}
                </div>
            )}

            <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
                <div className='rounded-lg border border-gray-300 bg-white p-4'>
                    <p className='text-sm font-semibold text-gray-600'>Spare Parts</p>
                    <p className='text-3xl font-bold'>{spares.length}</p>
                </div>
                <div className='rounded-lg border border-gray-300 bg-white p-4'>
                    <p className='text-sm font-semibold text-gray-600'>Total Quantity</p>
                    <p className='text-3xl font-bold'>{totals.quantity}</p>
                </div>
                <div className='rounded-lg border border-gray-300 bg-white p-4'>
                    <p className='text-sm font-semibold text-gray-600'>Stock Value</p>
                    <p className='text-3xl font-bold'>{totals.value}</p>
                </div>
                <div className='rounded-lg border border-gray-300 bg-white p-4'>
                    <p className='text-sm font-semibold text-gray-600'>Stock-In Records</p>
                    <p className='text-3xl font-bold'>{stockIns.length}</p>
                </div>
                <div className='rounded-lg border border-gray-300 bg-white p-4'>
                    <p className='text-sm font-semibold text-gray-600'>Stock-Out Records</p>
                    <p className='text-3xl font-bold'>{stockOuts.length}</p>
                </div>
            </section>

            <section className='grid gap-6 lg:grid-cols-3'>
                <Link to='/sparepart' className='rounded-lg border border-gray-300 bg-white p-5 hover:border-blue-500'>
                    <p className='text-sm font-semibold text-blue-700'>Manage</p>
                    <h2 className='mt-1 text-xl font-bold'>Spare Parts</h2>
                    <p className='mt-2 text-sm font-medium text-gray-600'>
                        Add, edit, and delete spare part records.
                    </p>
                </Link>

                <Link to='/spareIn' className='rounded-lg border border-gray-300 bg-white p-5 hover:border-blue-500'>
                    <p className='text-sm font-semibold text-blue-700'>Record</p>
                    <h2 className='mt-1 text-xl font-bold'>Stock In</h2>
                    <p className='mt-2 text-sm font-medium text-gray-600'>
                        Add incoming stock and keep quantities updated.
                    </p>
                </Link>

                <Link to='/spareOut' className='rounded-lg border border-gray-300 bg-white p-5 hover:border-blue-500'>
                    <p className='text-sm font-semibold text-blue-700'>Issue</p>
                    <h2 className='mt-1 text-xl font-bold'>Stock Out</h2>
                    <p className='mt-2 text-sm font-medium text-gray-600'>
                        Record spare parts leaving inventory.
                    </p>
                </Link>
            </section>

            <section className='grid gap-6 xl:grid-cols-2'>
                <div className='rounded-lg border border-gray-300 bg-white overflow-hidden'>
                    <div className='border-b border-gray-300 px-4 py-3'>
                        <h2 className='text-lg font-bold'>Latest Stock In</h2>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[640px] text-left text-sm'>
                            <thead className='bg-gray-200 text-gray-700'>
                                <tr>
                                    <th className='px-4 py-3'>ID</th>
                                    <th className='px-4 py-3'>Spare Part</th>
                                    <th className='px-4 py-3'>Quantity</th>
                                    <th className='px-4 py-3'>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestStockIns.map((stockIn) => (
                                    <tr key={stockIn.StockInId} className='border-t border-gray-200'>
                                        <td className='px-4 py-3'>{stockIn.StockInId}</td>
                                        <td className='px-4 py-3 font-semibold'>
                                            {spareById[stockIn.SparePartId]?.SparePartName || `Part #${stockIn.SparePartId}`}
                                        </td>
                                        <td className='px-4 py-3'>{stockIn.Quantity}</td>
                                        <td className='px-4 py-3'>{toDateInputValue(stockIn.StockInDate)}</td>
                                    </tr>
                                ))}

                                {latestStockIns.length === 0 && (
                                    <tr>
                                        <td colSpan='4' className='px-4 py-8 text-center font-semibold text-gray-500'>
                                            No stock-in records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='rounded-lg border border-gray-300 bg-white overflow-hidden'>
                    <div className='border-b border-gray-300 px-4 py-3'>
                        <h2 className='text-lg font-bold'>Latest Stock Out</h2>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[640px] text-left text-sm'>
                            <thead className='bg-gray-200 text-gray-700'>
                                <tr>
                                    <th className='px-4 py-3'>ID</th>
                                    <th className='px-4 py-3'>Spare Part</th>
                                    <th className='px-4 py-3'>Quantity</th>
                                    <th className='px-4 py-3'>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestStockOuts.map((stockOut) => (
                                    <tr key={stockOut.StockOutId} className='border-t border-gray-200'>
                                        <td className='px-4 py-3'>{stockOut.StockOutId}</td>
                                        <td className='px-4 py-3 font-semibold'>
                                            {spareById[stockOut.SparePartId]?.SparePartName || `Part #${stockOut.SparePartId}`}
                                        </td>
                                        <td className='px-4 py-3'>{stockOut.Quantity}</td>
                                        <td className='px-4 py-3'>{toDateInputValue(stockOut.StockOutDate)}</td>
                                    </tr>
                                ))}

                                {latestStockOuts.length === 0 && (
                                    <tr>
                                        <td colSpan='4' className='px-4 py-8 text-center font-semibold text-gray-500'>
                                            No stock-out records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AppLayout>
    )
}

export default Dashboard
