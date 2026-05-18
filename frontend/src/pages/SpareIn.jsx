import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../axios/api'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/useAuth'

const emptyStockInForm = {
    sparePartId: '',
    quantity: '',
    spareInDate: '',
}

const toDateInputValue = (date) => {
    if (!date) {
        return ''
    }

    return String(date).slice(0, 10)
}

const SpareIn = () => {
    const [spares, setSpares] = useState([])
    const [stockIns, setStockIns] = useState([])
    const [stockInForm, setStockInForm] = useState(emptyStockInForm)
    const [editingStockInId, setEditingStockInId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { logout } = useAuth()
    const navigate = useNavigate()

    const spareById = useMemo(() => {
        return spares.reduce((map, spare) => {
            map[spare.SparePartId] = spare
            return map
        }, {})
    }, [spares])

    const loadStockIn = useCallback(async () => {
        try {
            const [sparesRes, stockInsRes] = await Promise.all([
                api.get('/spareparts'),
                api.get('/spareIn'),
            ])

            setSpares(sparesRes.data?.data || [])
            setStockIns(stockInsRes.data?.data || [])
            setError('')
        } catch (err) {
            if (err.response?.status === 401) {
                logout()
                navigate('/login')
                return
            }

            setError(err.response?.data?.message || 'Unable to load stock-in records')
        } finally {
            setLoading(false)
        }
    }, [logout, navigate])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadStockIn()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [loadStockIn])

    const resetStockInForm = () => {
        setStockInForm(emptyStockInForm)
        setEditingStockInId(null)
    }

    const showSuccess = (message) => {
        setSuccess(message)
        setTimeout(() => setSuccess(''), 2500)
    }

    const handleStockInSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        const payload = {
            sparePartId: Number(stockInForm.sparePartId),
            quantity: Number(stockInForm.quantity),
            spareInDate: stockInForm.spareInDate,
        }

        try {
            const res = editingStockInId
                ? await api.put(`/spareIn/${editingStockInId}`, payload)
                : await api.post('/spareIn/create', payload)

            resetStockInForm()
            await loadStockIn()
            showSuccess(res.data?.message || 'Stock-in record saved')
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to save stock-in record')
        } finally {
            setSaving(false)
        }
    }

    const editStockIn = (stockIn) => {
        setEditingStockInId(stockIn.StockInId)
        setStockInForm({
            sparePartId: stockIn.SparePartId || '',
            quantity: stockIn.Quantity || '',
            spareInDate: toDateInputValue(stockIn.StockInDate),
        })
    }

    const deleteStockIn = async (stockInId) => {
        if (!window.confirm('Delete this stock-in record?')) {
            return
        }

        setError('')

        try {
            const res = await api.delete(`/spareIn/${stockInId}`)
            await loadStockIn()
            showSuccess(res.data?.message || 'Stock-in record deleted')
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete stock-in record')
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
                <div className='text-lg font-semibold text-gray-700'>Loading stock in...</div>
            </div>
        )
    }

    return (
        <AppLayout title='Stock In' subtitle='Record incoming spare part quantities'>
            {(error || success) && (
                <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${error ? 'border-red-500 bg-red-100 text-red-800' : 'border-green-500 bg-green-100 text-green-800'}`}>
                    {error || success}
                </div>
            )}

            <section className='grid gap-6 xl:grid-cols-[360px_1fr]'>
                <form onSubmit={handleStockInSubmit} className='rounded-lg border border-gray-300 bg-white p-4 flex flex-col gap-4'>
                    <div className='flex items-center justify-between gap-3'>
                        <h2 className='text-lg font-bold'>{editingStockInId ? 'Edit Stock In' : 'Add Stock In'}</h2>
                        {editingStockInId && (
                            <button type='button' onClick={resetStockInForm} className='text-sm font-semibold text-blue-600'>
                                Cancel
                            </button>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='sparePartId' className='text-sm font-semibold'>Spare Part</label>
                        <select
                            id='sparePartId'
                            value={stockInForm.sparePartId}
                            onChange={(e) => setStockInForm({ ...stockInForm, sparePartId: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                            required
                        >
                            <option value=''>Select spare part</option>
                            {spares.map((spare) => (
                                <option key={spare.SparePartId} value={spare.SparePartId}>
                                    {spare.SparePartName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='stockQuantity' className='text-sm font-semibold'>Quantity</label>
                        <input
                            id='stockQuantity'
                            type='number'
                            min='1'
                            value={stockInForm.quantity}
                            onChange={(e) => setStockInForm({ ...stockInForm, quantity: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='spareInDate' className='text-sm font-semibold'>Date</label>
                        <input
                            id='spareInDate'
                            type='date'
                            value={stockInForm.spareInDate}
                            onChange={(e) => setStockInForm({ ...stockInForm, spareInDate: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={saving || spares.length === 0}
                        className='rounded-lg bg-blue-600 px-4 py-2 font-bold text-white disabled:bg-blue-300'
                    >
                        {saving ? 'Saving...' : editingStockInId ? 'Update Stock In' : 'Save Stock In'}
                    </button>
                </form>

                <div className='rounded-lg border border-gray-300 bg-white overflow-hidden'>
                    <div className='border-b border-gray-300 px-4 py-3'>
                        <h2 className='text-lg font-bold'>Stock In</h2>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[720px] text-left text-sm'>
                            <thead className='bg-gray-200 text-gray-700'>
                                <tr>
                                    <th className='px-4 py-3'>ID</th>
                                    <th className='px-4 py-3'>Spare Part</th>
                                    <th className='px-4 py-3'>Quantity</th>
                                    <th className='px-4 py-3'>Date</th>
                                    <th className='px-4 py-3 text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockIns.map((stockIn) => (
                                    <tr key={stockIn.StockInId} className='border-t border-gray-200'>
                                        <td className='px-4 py-3'>{stockIn.StockInId}</td>
                                        <td className='px-4 py-3 font-semibold'>
                                            {spareById[stockIn.SparePartId]?.SparePartName || `Part #${stockIn.SparePartId}`}
                                        </td>
                                        <td className='px-4 py-3'>{stockIn.Quantity}</td>
                                        <td className='px-4 py-3'>{toDateInputValue(stockIn.StockInDate)}</td>
                                        <td className='px-4 py-3'>
                                            <div className='flex justify-end gap-2'>
                                                <button type='button' onClick={() => editStockIn(stockIn)} className='rounded-md border border-blue-500 px-3 py-1 font-semibold text-blue-700'>
                                                    Edit
                                                </button>
                                                <button type='button' onClick={() => deleteStockIn(stockIn.StockInId)} className='rounded-md border border-red-500 px-3 py-1 font-semibold text-red-700'>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {stockIns.length === 0 && (
                                    <tr>
                                        <td colSpan='5' className='px-4 py-8 text-center font-semibold text-gray-500'>No stock-in records found.</td>
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

export default SpareIn
