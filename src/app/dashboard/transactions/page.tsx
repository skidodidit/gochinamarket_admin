"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { fetchTransactions, fetchTransactionById, updateTransaction } from '@/lib/api/transaction';
import { useApi } from '@/hooks/useApi';
import { TransactionDTO, TransactionResponse, FetchTransactionsParams } from '@/types';

// Separate component that uses useSearchParams
function TransactionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'cancelled' | ''>('');
  const [typeFilter, setTypeFilter] = useState<'buy' | 'sell' | ''>('');
  const [userSearch, setUserSearch] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  // API hooks - Fixed type arguments
  const { loading: allLoading, error: allError, run: runAll, data: allData } = useApi<any[], TransactionResponse>(fetchTransactions);
  const { loading: singleLoading, error: singleError, run: runSingle, data: singleData } = useApi<any[], TransactionDTO>(fetchTransactionById);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi<[string, Partial<TransactionDTO>], TransactionDTO>(updateTransaction);

  // Handle URL-based modal
  useEffect(() => {
    const transactionId = searchParams.get('transaction');
    if (transactionId) {
      setSelectedTransactionId(transactionId);
      runSingle(transactionId);
    } else {
      setSelectedTransactionId(null);
    }
  }, [searchParams, runSingle]);

  // Load transactions
  useEffect(() => {
    const params: FetchTransactionsParams = {
      page: currentPage,
      limit,
      ...(statusFilter && { status: statusFilter }),
      ...(typeFilter && { type: typeFilter }),
      ...(userSearch && { user: userSearch }),
    };
    runAll(params);
  }, [currentPage, statusFilter, typeFilter, userSearch, runAll]);

  // Handle transaction click
  const handleTransactionClick = (transactionId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('transaction', transactionId);
    router.push(url.pathname + url.search);
  };

  // Handle modal close
  const handleModalClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('transaction');
    router.push(url.pathname + url.search);
  };

  // Handle status update
  const handleStatusUpdate = async (status: 'completed' | 'cancelled') => {
    if (selectedTransactionId) {
      await runUpdate(selectedTransactionId, {status});
      if (updateSuccess) {
        // Refresh transactions list
        const params: FetchTransactionsParams = {
          page: currentPage,
          limit,
          ...(statusFilter && { status: statusFilter }),
          ...(typeFilter && { type: typeFilter }),
          ...(userSearch && { user: userSearch }),
        };
        runAll(params);
        // Refresh single transaction
        runSingle(selectedTransactionId);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'buy' 
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-6 mb-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search User</label>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Enter user ID or email"
                className="w-full px-4 py-2 bg-gray-700/50 border border-emerald-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full px-4 py-2 bg-gray-700/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="w-full px-4 py-2 bg-gray-700/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setTypeFilter('');
                  setUserSearch('');
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {allLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {allError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">Error loading transactions: {String(allError)}</p>
          </div>
        )}

        {/* Transactions Table */}
        {allData && (
          <>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-900/50 to-green-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300">Transaction ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300">Currency</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.data.map((transaction) => (
                      <tr
                        key={transaction._id}
                        onClick={() => handleTransactionClick(transaction._id?.toString() || '')}
                        className="border-t border-gray-700/50 hover:bg-emerald-500/5 cursor-pointer transition-all duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                          {transaction._id?.toString().slice(-8)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 truncate max-w-32">
                          {transaction.user}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(transaction.type)}`}>
                            {transaction.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {transaction.currencyAmount?.toLocaleString()} / {transaction.cryptoCurrencyAmount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {transaction.currency} / {transaction.cryptoCurrency}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {((allData.meta.page - 1) * allData.meta.limit) + 1} to{' '}
                {Math.min(allData.meta.page * allData.meta.limit, allData.meta.total)} of{' '}
                {allData.meta.total} transactions
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                  {currentPage} of {allData.meta.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, allData.meta.totalPages))}
                  disabled={currentPage === allData.meta.totalPages}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Modal */}
        {selectedTransactionId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-emerald-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                    Transaction Details
                  </h2>
                  <button
                    onClick={handleModalClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Loading */}
                {singleLoading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
                  </div>
                )}

                {/* Error */}
                {singleError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                    <p className="text-red-300">Error loading transaction: {String(singleError)}</p>
                  </div>
                )}

                {/* Transaction Details */}
                {singleData && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Transaction ID</label>
                          <p className="text-white font-mono text-sm bg-gray-700/50 p-2 rounded">{singleData._id}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">User</label>
                          <p className="text-white">{singleData.user}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(singleData.type)}`}>
                            {singleData.type.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Current Status</label>
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(singleData.status)}`}>
                            {singleData.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Currency Amount</label>
                          <p className="text-white text-lg">{singleData.currencyAmount?.toLocaleString()} {singleData.currency}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Crypto Amount</label>
                          <p className="text-white text-lg">{singleData.cryptoCurrencyAmount} {singleData.cryptoCurrency}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Conversion Rate</label>
                          <p className="text-white">{singleData.conversionRateUsed}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Network</label>
                          <p className="text-white">{singleData.network || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Info */}
                    {(singleData?.walletSentTo || singleData.walletToReceive) && (
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-emerald-300 mb-3">Wallet Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {singleData.walletSentTo && (
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Wallet Sent To</label>
                              <p className="text-white font-mono text-sm bg-gray-700/50 p-2 rounded break-all">{singleData.walletSentTo}</p>
                            </div>
                          )}
                          {singleData.walletToReceive && (
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Wallet To Receive</label>
                              <p className="text-white font-mono text-sm bg-gray-700/50 p-2 rounded break-all">{singleData.walletToReceive}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Account Info */}
                    {(singleData?.accountSentTo || singleData.accountToReceive) && (
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-emerald-300 mb-3">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {singleData.accountSentTo && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-400">Account Sent To</h4>
                              <div className="bg-gray-700/50 p-3 rounded">
                                <p className="text-white"><span className="text-gray-400">Name:</span> {singleData.accountSentTo.accountName}</p>
                                <p className="text-white"><span className="text-gray-400">Number:</span> {singleData.accountSentTo.accountNumber}</p>
                                <p className="text-white"><span className="text-gray-400">Bank:</span> {singleData.accountSentTo.bankName}</p>
                              </div>
                            </div>
                          )}
                          {singleData.accountToReceive && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-400">Account To Receive</h4>
                              <div className="bg-gray-700/50 p-3 rounded">
                                <p className="text-white"><span className="text-gray-400">Name:</span> {singleData.accountToReceive.accountName}</p>
                                <p className="text-white"><span className="text-gray-400">Number:</span> {singleData.accountToReceive.accountNumber}</p>
                                <p className="text-white"><span className="text-gray-400">Bank:</span> {singleData.accountToReceive.bankName}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Update Actions */}
                    {singleData?.status === 'pending' && (
                      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-emerald-300 mb-3">Update Transaction Status</h3>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleStatusUpdate('completed')}
                            disabled={updateLoading}
                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                          >
                            {updateLoading ? 'Updating...' : 'Mark as Completed'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate('cancelled')}
                            disabled={updateLoading}
                            className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
                          >
                            {updateLoading ? 'Updating...' : 'Cancel Transaction'}
                          </button>
                        </div>
                        {updateError && (
                          <p className="text-red-300 text-sm mt-2">Error updating transaction: {String(updateError)}</p>
                        )}
                        {updateSuccess && (
                          <p className="text-green-300 text-sm mt-2">Transaction updated successfully!</p>
                        )}
                      </div>
                    )}

                    <div className="text-sm text-gray-400">
                      Created: {singleData.createdAt ? new Date(singleData.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function TransactionPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AdminTransactionPage() {
  return (
    <Suspense fallback={<TransactionPageLoading />}>
      <TransactionPageContent />
    </Suspense>
  );
}