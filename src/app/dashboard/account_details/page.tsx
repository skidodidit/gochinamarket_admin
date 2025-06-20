"use client";

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { createAccount, fetchAccount, fetchAccountById, updateAccount, deleteAccount } from '@/lib/api/account';
import { BankAccountDTO } from '@/types';

export default function AdminAccountPage() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccountDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<BankAccountDTO>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    wallet: '',
    currency: '',
    network: ''
  });

  const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createAccount);
  const { loading: allLoading, error: allError, success: allSuccess, run: runAll, data: allData } = useApi(fetchAccount);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateAccount);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteAccount);

  useEffect(() => {
    runAll();
  }, []);

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      runAll();
      setIsEditing(false);
      setShowCreateForm(false);
      setSelectedAccount(null);
      resetForm();
    }
  }, [createSuccess, updateSuccess, deleteSuccess]);

  const resetForm = () => {
    setFormData({
      accountName: '',
      accountNumber: '',
      bankName: '',
      wallet: '',
      currency: '',
      network: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    await runCreate(formData);
  };

  const handleUpdate = async () => {
    if (selectedAccount) {
      await runUpdate((selectedAccount._id || ''), formData);
    }
  };

  const handleEdit = (account: BankAccountDTO) => {
    setSelectedAccount(account);
    setFormData(account);
    setIsEditing(true);
    setShowCreateForm(false);
  };

  const handleDelete = async (accountNumber: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      await runDelete(accountNumber);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowCreateForm(false);
    setSelectedAccount(null);
    resetForm();
  };

  const hasAccounts = allData && allData.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Action Buttons */}
        <div className="mb-6 flex gap-4">
          {!hasAccounts && !showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Create Bank Account
            </button>
          )}
          
          {(isEditing || showCreateForm) && (
            <button
              onClick={handleCancel}
              className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Loading State */}
        {allLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
        )}

        {/* Error Messages */}
        {(allError || createError || updateError || deleteError) && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {allError || createError || updateError || deleteError}
          </div>
        )}

        {/* Success Messages */}
        {(createSuccess || updateSuccess || deleteSuccess) && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
            {createSuccess && "Account created successfully!"}
            {updateSuccess && "Account updated successfully!"}
            {deleteSuccess && "Account deleted successfully!"}
          </div>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || isEditing) && (
          <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-green-500/20">
            <h2 className="text-2xl font-bold text-green-400 mb-6">
              {isEditing ? 'Edit Account' : 'Create New Account'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-green-300 text-sm font-semibold mb-2">Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Enter account name"
                />
              </div>

              <div>
                <label className="block text-green-300 text-sm font-semibold mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-green-300 text-sm font-semibold mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="block text-green-300 text-sm font-semibold mb-2">Wallet</label>
                <input
                  type="text"
                  name="wallet"
                  value={formData.wallet}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Enter wallet address"
                />
              </div>

              <div>
                <label className="block text-green-300 text-sm font-semibold mb-2">Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Enter currency (e.g., USD, BTC)"
                />
              </div>

              <div>
                <label className="block text-green-300 text-sm font-semibold mb-2">Network</label>
                <input
                  type="text"
                  name="network"
                  value={formData.network}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Enter network (e.g., Ethereum, Bitcoin)"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="button"
                  onClick={isEditing ? handleUpdate : handleCreate}
                  disabled={createLoading || updateLoading}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {(createLoading || updateLoading) ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    isEditing ? 'Update Account' : 'Create Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accounts List */}
        {hasAccounts && !showCreateForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-green-500/20 overflow-hidden">
            <div className="p-6 border-b border-green-500/20">
              <h2 className="text-2xl font-bold text-green-400">Your Bank Accounts</h2>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6">
                {allData?.map((account, index) => (
                  <div key={account.accountNumber} className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-green-300 text-sm font-semibold">Account Name</p>
                        <p className="text-white text-lg">{account.accountName}</p>
                      </div>
                      <div>
                        <p className="text-green-300 text-sm font-semibold">Account Number</p>
                        <p className="text-white text-lg font-mono">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-green-300 text-sm font-semibold">Bank Name</p>
                        <p className="text-white text-lg">{account.bankName}</p>
                      </div>
                      <div>
                        <p className="text-green-300 text-sm font-semibold">Wallet</p>
                        <p className="text-white text-sm font-mono break-all">{account.wallet}</p>
                      </div>
                      <div>
                        <p className="text-green-300 text-sm font-semibold">Currency</p>
                        <p className="text-white text-lg">{account.currency}</p>
                      </div>
                      <div>
                        <p className="text-green-300 text-sm font-semibold">Network</p>
                        <p className="text-white text-lg">{account.network}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-green-500/20">
                      <button
                        onClick={() => handleEdit(account)}
                        disabled={isEditing}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(account.accountNumber)}
                        disabled={deleteLoading || isEditing}
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                      >
                        {deleteLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Deleting...
                          </div>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasAccounts && !allLoading && !showCreateForm && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl border border-green-500/20 max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">No Bank Accounts</h3>
              <p className="text-green-300/70 mb-6">You haven't created any bank accounts yet. Create your first account to get started.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Your First Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}