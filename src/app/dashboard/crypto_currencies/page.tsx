"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createCrypto, fetchCrypto, fetchCryptoById, updateCrypto, deleteCrypto } from '@/lib/api/crypto';
import { useApi } from '@/hooks/useApi';
import { CryptoDTO } from '@/types';

export default function AdminCryptoPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCrypto, setEditingCrypto] = useState<CryptoDTO | null>(null);
    const [formData, setFormData] = useState<Partial<CryptoDTO>>({
        crypto: '',
        network: '',
        rate: 0,
        cryptoImage: '',
        networkImage: '',
        wallet: ''
    });

    const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createCrypto);
    const { loading: allLoading, error: allError, success: allSuccess, run: runAll, data: allData } = useApi(fetchCrypto);
    const { loading: singleLoading, error: singleError, success: singleSuccess, run: runSingle, data: singleData } = useApi(fetchCryptoById);
    const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateCrypto);
    const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteCrypto);

    // Load all crypto data on component mount
    useEffect(() => {
        runAll();
    }, []);

    // Refresh data after successful operations
    useEffect(() => {
        if (createSuccess || updateSuccess || deleteSuccess) {
            runAll();
            handleCloseForm();
        }
    }, [createSuccess, updateSuccess, deleteSuccess]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rate' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async () => {
        if (editingCrypto) {
            await runUpdate(editingCrypto._id, formData);
        } else {
            await runCreate(formData as CryptoDTO);
        }
    };

    const handleEdit = (crypto: CryptoDTO) => {
        setEditingCrypto(crypto);
        setFormData(crypto);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this crypto?')) {
            await runDelete(id);
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingCrypto(null);
        setFormData({
            crypto: '',
            network: '',
            rate: 0,
            cryptoImage: '',
            networkImage: '',
            wallet: ''
        });
    };

    const handleOpenForm = () => {
        setIsFormOpen(true);
        setEditingCrypto(null);
        setFormData({
            crypto: '',
            network: '',
            rate: 0,
            cryptoImage: '',
            networkImage: '',
            wallet: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Add New Button */}
                <div className="mb-6">
                    <button
                        onClick={handleOpenForm}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 border border-green-400/20"
                    >
                        <span className="mr-2">+</span>
                        Add New Crypto
                    </button>
                </div>

                {/* Error Messages */}
                {(createError || allError || updateError || deleteError) && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                        <p className="text-red-400">
                            {createError || allError || updateError || deleteError}
                        </p>
                    </div>
                )}

                {/* Success Messages */}
                {(createSuccess || updateSuccess || deleteSuccess) && (
                    <div className="mb-6 p-4 bg-green-900/50 border border-green-500/50 rounded-lg">
                        <p className="text-green-400">
                            Operation completed successfully!
                        </p>
                    </div>
                )}

                {/* Form Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-green-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                    {editingCrypto ? 'Edit Crypto' : 'Add New Crypto'}
                                </h2>
                                <button
                                    onClick={handleCloseForm}
                                    className="text-gray-400 hover:text-white text-2xl transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-green-400 font-semibold mb-2">
                                            Crypto Name
                                        </label>
                                        <input
                                            type="text"
                                            name="crypto"
                                            value={formData.crypto}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-gray-700/50 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                            placeholder="e.g., Bitcoin"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-green-400 font-semibold mb-2">
                                            Network
                                        </label>
                                        <input
                                            type="text"
                                            name="network"
                                            value={formData.network}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-gray-700/50 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                            placeholder="e.g., Bitcoin Network"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-green-400 font-semibold mb-2">
                                            Rate
                                        </label>
                                        <input
                                            type="number"
                                            name="rate"
                                            value={formData.rate}
                                            onChange={handleInputChange}
                                            required
                                            step="0.01"
                                            className="w-full bg-gray-700/50 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-green-400 font-semibold mb-2">
                                            Wallet Address
                                        </label>
                                        <input
                                            type="text"
                                            name="wallet"
                                            value={formData.wallet}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-gray-700/50 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                            placeholder="Wallet address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-green-400 font-semibold mb-2">
                                            Crypto Image URL
                                        </label>
                                        <input
                                            type="url"
                                            name="cryptoImage"
                                            value={formData.cryptoImage}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700/50 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                            placeholder="https://example.com/image.png"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-green-400 font-semibold mb-2">
                                            Network Image URL
                                        </label>
                                        <input
                                            type="url"
                                            name="networkImage"
                                            value={formData.networkImage}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700/50 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                            placeholder="https://example.com/network.png"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={createLoading || updateLoading}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/25"
                                    >
                                        {(createLoading || updateLoading) ? 'Processing...' : (editingCrypto ? 'Update Crypto' : 'Create Crypto')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-green-500/20 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-green-500/20">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                            Crypto List
                        </h2>
                    </div>

                    {allLoading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                            <p className="text-gray-400 mt-4">Loading cryptocurrencies...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-900/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-green-400 font-semibold">Crypto</th>
                                        <th className="px-6 py-4 text-left text-green-400 font-semibold">Network</th>
                                        <th className="px-6 py-4 text-left text-green-400 font-semibold">Rate</th>
                                        <th className="px-6 py-4 text-left text-green-400 font-semibold">Wallet</th>
                                        <th className="px-6 py-4 text-left text-green-400 font-semibold">Images</th>
                                        <th className="px-6 py-4 text-left text-green-400 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allData && allData.length > 0 ? (
                                        allData.map((crypto, index) => (
                                            <tr key={crypto._id || index} className="border-b border-gray-700/50 hover:bg-green-900/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {crypto.cryptoImage && (
                                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-green-500/30">
                                                                <img
                                                                    src={crypto?.cryptoImage || 'https://media.istockphoto.com/id/1264040074/vector/placeholder-rgb-color-icon.jpg?s=612x612&w=0&k=20&c=0ZFUNL28htu-zHRF9evishuNKYQAZVrfK0-TZNjnX3U='}
                                                                    alt={crypto.crypto}
                                                                    width={32}
                                                                    height={32}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <span className="text-white font-semibold">{crypto.crypto}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {crypto.networkImage && (
                                                            <div className="w-6 h-6 rounded overflow-hidden border border-green-500/30">
                                                                <img
                                                                    src={crypto?.networkImage || 'https://media.istockphoto.com/id/1264040074/vector/placeholder-rgb-color-icon.jpg?s=612x612&w=0&k=20&c=0ZFUNL28htu-zHRF9evishuNKYQAZVrfK0-TZNjnX3U='}
                                                                    alt={'network'}
                                                                    width={24}
                                                                    height={24}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <span className="text-gray-300">{crypto.network}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-green-400 font-mono font-semibold">${crypto.rate.toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-300 font-mono text-sm bg-gray-700/30 px-2 py-1 rounded border border-green-500/20">
                                                        {crypto.wallet.substring(0, 10)}...{crypto.wallet.substring(crypto.wallet.length - 6)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {crypto.cryptoImage && (
                                                            <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/30">Crypto</span>
                                                        )}
                                                        {crypto.networkImage && (
                                                            <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded text-xs border border-purple-500/30">Network</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(crypto)}
                                                            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded border border-blue-500/30 transition-all duration-300 text-sm font-semibold"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(crypto._id)}
                                                            disabled={deleteLoading}
                                                            className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded border border-red-500/30 transition-all duration-300 text-sm font-semibold disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
                                                        <span className="text-2xl">💰</span>
                                                    </div>
                                                    <p>No cryptocurrencies found. Add your first crypto to get started!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}