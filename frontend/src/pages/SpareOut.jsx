import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../axios/api'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/useAuth'

const emptyStockOutForm = {
    sparePartId: '',
    quantity: '',
    stockOutDate: '',
}

const toDateInputValue = (date) => {
    if (!date) {
        return ''
    }

    return String(date).slice(0, 10)
}

const SpareOut = () => {
    const [spares, setSpares] = useState([])
    const [stockOuts, setStockOuts] = useState([])
    const [stockOutForm, setStockOutForm] = useState(emptyStockOutForm)
    const [editingStockOutId, setEditingStockOutId] = useState(null)
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

    const selectedSpare = spareById[stockOutForm.sparePartId]
    const selectedQuantity = Number(stockOutForm.quantity || 0)
    const selectedUnitPrice = Number(selectedSpare?.UnitPrice || 0)
    const selectedTotal = selectedQuantity * selectedUnitPrice

    const loadStockOut = useCallback(async () => {
        try {
            const [sparesRes, stockOutsRes] = await Promise.all([
                api.get('/spareparts'),
                api.get('/spareOut'),
            ])

            setSpares(sparesRes.data?.data || [])
            setStockOuts(stockOutsRes.data?.data || [])
            setError('')
        } catch (err) {
            if (err.response?.status === 401) {
                logout()
                navigate('/login')
                return
            }

            setError(err.response?.data?.message || 'Unable to load stock-out records')
        } finally {
            setLoading(false)
        }
    }, [logout, navigate])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadStockOut()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [loadStockOut])

    const resetStockOutForm = () => {
        setStockOutForm(emptyStockOutForm)
        setEditingStockOutId(null)
    }

    const showSuccess = (message) => {
        setSuccess(message)
        setTimeout(() => setSuccess(''), 2500)
    }

    const handleStockOutSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        const payload = {
            sparePartId: Number(stockOutForm.sparePartId),
            quantity: Number(stockOutForm.quantity),
            stockOutDate: stockOutForm.stockOutDate,
        }

        try {
            const res = editingStockOutId
                ? await api.put(`/spareOut/${editingStockOutId}`, payload)
                : await api.post('/spareOut/create', payload)

            resetStockOutForm()
            await loadStockOut()
            showSuccess(res.data?.message || 'Stock-out record saved')
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to save stock-out record')
        } finally {
            setSaving(false)
        }
    }

    const editStockOut = (stockOut) => {
        setEditingStockOutId(stockOut.StockOutId)
        setStockOutForm({
            sparePartId: stockOut.SparePartId || '',
            quantity: stockOut.Quantity || '',
            stockOutDate: toDateInputValue(stockOut.StockOutDate),
        })
    }

    const deleteStockOut = async (stockOutId) => {
        if (!window.confirm('Delete this stock-out record?')) {
            return
        }

        setError('')

        try {
            const res = await api.delete(`/spareOut/${stockOutId}`)
            await loadStockOut()
            showSuccess(res.data?.message || 'Stock-out record deleted')
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete stock-out record')
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
                <div className='text-lg font-semibold text-gray-700'>Loading stock out...</div>
            </div>
        )
    }

    return (
        <AppLayout title='Stock Out' subtitle='Record spare parts leaving inventory'>
            {(error || success) && (
                <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${error ? 'border-red-500 bg-red-100 text-red-800' : 'border-green-500 bg-green-100 text-green-800'}`}>
                    {error || success}
                </div>
            )}

            <section className='grid gap-6 xl:grid-cols-[360px_1fr]'>
                <form onSubmit={handleStockOutSubmit} className='rounded-lg border border-gray-300 bg-white p-4 flex flex-col gap-4'>
                    <div className='flex items-center justify-between gap-3'>
                        <h2 className='text-lg font-bold'>{editingStockOutId ? 'Edit Stock Out' : 'Add Stock Out'}</h2>
                        {editingStockOutId && (
                            <button type='button' onClick={resetStockOutForm} className='text-sm font-semibold text-blue-600'>
                                Cancel
                            </button>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='stockOutSparePartId' className='text-sm font-semibold'>Spare Part</label>
                        <select
                            id='stockOutSparePartId'
                            value={stockOutForm.sparePartId}
                            onChange={(e) => setStockOutForm({ ...stockOutForm, sparePartId: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                            required
                        >
                            <option value=''>Select spare part</option>
                            {spares.map((spare) => (
                                <option key={spare.SparePartId} value={spare.SparePartId}>
                                    {spare.SparePartName} ({spare.Quantity} available)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='stockOutQuantity' className='text-sm font-semibold'>Quantity</label>
                        <input
                            id='stockOutQuantity'
                            type='number'
                            min='1'
                            value={stockOutForm.quantity}
                            onChange={(e) => setStockOutForm({ ...stockOutForm, quantity: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='stockOutDate' className='text-sm font-semibold'>Date</label>
                        <input
                            id='stockOutDate'
                            type='date'
                            value={stockOutForm.stockOutDate}
                            onChange={(e) => setStockOutForm({ ...stockOutForm, stockOutDate: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                            required
                        />
                    </div>

                    <div className='rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm font-semibold text-gray-700'>
                        Unit Price: {selectedUnitPrice || 0} | Total: {selectedTotal || 0}
                    </div>

                    <button
                        type='submit'
                        disabled={saving || spares.length === 0}
                        className='rounded-lg bg-blue-600 px-4 py-2 font-bold text-white disabled:bg-blue-300'
                    >
                        {saving ? 'Saving...' : editingStockOutId ? 'Update Stock Out' : 'Save Stock Out'}
                    </button>
                </form>

                <div className='rounded-lg border border-gray-300 bg-white overflow-hidden'>
                    <div className='border-b border-gray-300 px-4 py-3'>
                        <h2 className='text-lg font-bold'>Stock Out</h2>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[860px] text-left text-sm'>
                            <thead className='bg-gray-200 text-gray-700'>
                                <tr>
                                    <th className='px-4 py-3'>ID</th>
                                    <th className='px-4 py-3'>Spare Part</th>
                                    <th className='px-4 py-3'>Quantity</th>
                                    <th className='px-4 py-3'>Unit Price</th>
                                    <th className='px-4 py-3'>Total</th>
                                    <th className='px-4 py-3'>Date</th>
                                    <th className='px-4 py-3 text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockOuts.map((stockOut) => (
                                    <tr key={stockOut.StockOutId} className='border-t border-gray-200'>
                                        <td className='px-4 py-3'>{stockOut.StockOutId}</td>
                                        <td className='px-4 py-3 font-semibold'>
                                            {spareById[stockOut.SparePartId]?.SparePartName || `Part #${stockOut.SparePartId}`}
                                        </td>
                                        <td className='px-4 py-3'>{stockOut.Quantity}</td>
                                        <td className='px-4 py-3'>{stockOut.UnitPrice}</td>
                                        <td className='px-4 py-3'>{stockOut.TotalPrice}</td>
                                        <td className='px-4 py-3'>{toDateInputValue(stockOut.StockOutDate)}</td>
                                        <td className='px-4 py-3'>
                                            <div className='flex justify-end gap-2'>
                                                <button type='button' onClick={() => editStockOut(stockOut)} className='rounded-md border border-blue-500 px-3 py-1 font-semibold text-blue-700'>
                                                    Edit
                                                </button>
                                                <button type='button' onClick={() => deleteStockOut(stockOut.StockOutId)} className='rounded-md border border-red-500 px-3 py-1 font-semibold text-red-700'>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {stockOuts.length === 0 && (
                                    <tr>
                                        <td colSpan='7' className='px-4 py-8 text-center font-semibold text-gray-500'>No stock-out records found.</td>
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

export default SpareOut
