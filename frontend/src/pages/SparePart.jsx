import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../axios/api'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/useAuth'

const emptySpareForm = {
    spareName: '',
    category: '',
    unitPrice: '',
    quantity: '',
}

const SparePart = () => {
    const [spares, setSpares] = useState([])
    const [spareForm, setSpareForm] = useState(emptySpareForm)
    const [editingSpareId, setEditingSpareId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { logout } = useAuth()
    const navigate = useNavigate()

    const loadSpares = useCallback(async () => {
        try {
            const res = await api.get('/spareparts')
            setSpares(res.data?.data || [])
            setError('')
        } catch (err) {
            if (err.response?.status === 401) {
                logout()
                navigate('/login')
                return
            }

            setError(err.response?.data?.message || 'Unable to load spare parts')
        } finally {
            setLoading(false)
        }
    }, [logout, navigate])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadSpares()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [loadSpares])

    const resetSpareForm = () => {
        setSpareForm(emptySpareForm)
        setEditingSpareId(null)
    }

    const showSuccess = (message) => {
        setSuccess(message)
        setTimeout(() => setSuccess(''), 2500)
    }

    const handleSpareSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        const payload = {
            spareName: spareForm.spareName,
            category: spareForm.category,
            unitPrice: Number(spareForm.unitPrice),
            quantity: Number(spareForm.quantity || 0),
        }

        try {
            const res = editingSpareId
                ? await api.put(`/spareparts/${editingSpareId}`, payload)
                : await api.post('/spareparts', payload)

            resetSpareForm()
            await loadSpares()
            showSuccess(res.data?.message || 'Spare part saved')
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to save spare part')
        } finally {
            setSaving(false)
        }
    }

    const editSpare = (spare) => {
        setEditingSpareId(spare.SparePartId)
        setSpareForm({
            spareName: spare.SparePartName || '',
            category: spare.Category || '',
            unitPrice: spare.UnitPrice || '',
            quantity: spare.Quantity || '',
        })
    }

    const deleteSpare = async (spareId) => {
        if (!window.confirm('Delete this spare part?')) {
            return
        }

        setError('')

        try {
            const res = await api.delete(`/spareparts/${spareId}`)
            await loadSpares()
            showSuccess(res.data?.message || 'Spare part deleted')
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete spare part')
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
                <div className='text-lg font-semibold text-gray-700'>Loading spare parts...</div>
            </div>
        )
    }

    return (
        <AppLayout title='Spare Parts' subtitle='Create and maintain spare part records'>
            {(error || success) && (
                <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${error ? 'border-red-500 bg-red-100 text-red-800' : 'border-green-500 bg-green-100 text-green-800'}`}>
                    {error || success}
                </div>
            )}

            <section className='grid gap-6 xl:grid-cols-[360px_1fr]'>
                <form onSubmit={handleSpareSubmit} className='rounded-lg border border-gray-300 bg-white p-4 flex flex-col gap-4'>
                    <div className='flex items-center justify-between gap-3'>
                        <h2 className='text-lg font-bold'>{editingSpareId ? 'Edit Spare Part' : 'Add Spare Part'}</h2>
                        {editingSpareId && (
                            <button type='button' onClick={resetSpareForm} className='text-sm font-semibold text-blue-600'>
                                Cancel
                            </button>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='spareName' className='text-sm font-semibold'>Name</label>
                        <input
                            id='spareName'
                            type='text'
                            value={spareForm.spareName}
                            onChange={(e) => setSpareForm({ ...spareForm, spareName: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='category' className='text-sm font-semibold'>Category</label>
                        <input
                            id='category'
                            type='text'
                            value={spareForm.category}
                            onChange={(e) => setSpareForm({ ...spareForm, category: e.target.value })}
                            className='rounded-lg border border-gray-400 px-3 py-2'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='unitPrice' className='text-sm font-semibold'>Unit Price</label>
                            <input
                                id='unitPrice'
                                type='number'
                                min='0'
                                value={spareForm.unitPrice}
                                onChange={(e) => setSpareForm({ ...spareForm, unitPrice: e.target.value })}
                                className='rounded-lg border border-gray-400 px-3 py-2'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor='quantity' className='text-sm font-semibold'>Quantity</label>
                            <input
                                id='quantity'
                                type='number'
                                min='0'
                                value={spareForm.quantity}
                                onChange={(e) => setSpareForm({ ...spareForm, quantity: e.target.value })}
                                className='rounded-lg border border-gray-400 px-3 py-2'
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={saving}
                        className='rounded-lg bg-blue-600 px-4 py-2 font-bold text-white disabled:bg-blue-300'
                    >
                        {saving ? 'Saving...' : editingSpareId ? 'Update Spare Part' : 'Save Spare Part'}
                    </button>
                </form>

                <div className='rounded-lg border border-gray-300 bg-white overflow-hidden'>
                    <div className='border-b border-gray-300 px-4 py-3'>
                        <h2 className='text-lg font-bold'>Spare Parts</h2>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[720px] text-left text-sm'>
                            <thead className='bg-gray-200 text-gray-700'>
                                <tr>
                                    <th className='px-4 py-3'>ID</th>
                                    <th className='px-4 py-3'>Name</th>
                                    <th className='px-4 py-3'>Category</th>
                                    <th className='px-4 py-3'>Unit Price</th>
                                    <th className='px-4 py-3'>Quantity</th>
                                    <th className='px-4 py-3 text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spares.map((spare) => (
                                    <tr key={spare.SparePartId} className='border-t border-gray-200'>
                                        <td className='px-4 py-3'>{spare.SparePartId}</td>
                                        <td className='px-4 py-3 font-semibold'>{spare.SparePartName}</td>
                                        <td className='px-4 py-3'>{spare.Category || '-'}</td>
                                        <td className='px-4 py-3'>{spare.UnitPrice}</td>
                                        <td className='px-4 py-3'>{spare.Quantity}</td>
                                        <td className='px-4 py-3'>
                                            <div className='flex justify-end gap-2'>
                                                <button type='button' onClick={() => editSpare(spare)} className='rounded-md border border-blue-500 px-3 py-1 font-semibold text-blue-700'>
                                                    Edit
                                                </button>
                                                <button type='button' onClick={() => deleteSpare(spare.SparePartId)} className='rounded-md border border-red-500 px-3 py-1 font-semibold text-red-700'>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {spares.length === 0 && (
                                    <tr>
                                        <td colSpan='6' className='px-4 py-8 text-center font-semibold text-gray-500'>No spare parts found.</td>
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

export default SparePart
