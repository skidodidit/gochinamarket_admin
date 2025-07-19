'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { getAllOrders, updateOrderStatus, deleteOrder } from '@/lib/api/order';
import { Order } from '@/types';
import { notifyError, notifySuccess } from '@/lib/toast';
import { Search, Filter, Eye, Edit, Trash2, Package, Clock, CheckCircle, XCircle, AlertCircle, Calendar, MessageSquare } from 'lucide-react';

export default function AdminOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({ 
    status: '', 
    paymentStatus: '', 
    deliveryDate: '',
    feedBack: ''
  });

  const { 
    loading: ordersLoading, 
    error: ordersError, 
    success: ordersSuccess, 
    run: runGetOrders, 
    data: ordersData 
  } = useApi(getAllOrders);

  const { 
    loading: updateLoading, 
    error: updateError, 
    success: updateSuccess, 
    run: runUpdateOrder 
  } = useApi(updateOrderStatus);

  const { 
    loading: deleteLoading, 
    error: deleteError, 
    success: deleteSuccess, 
    run: runDeleteOrder 
  } = useApi(deleteOrder);

  const fetchOrders = () => {
    const params = {
      page: currentPage,
      limit: 10,
      ...(statusFilter && { status: statusFilter }),
    };
    runGetOrders(params);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (updateSuccess) {
      notifySuccess('Order updated successfully');
      setShowUpdateModal(false);
      fetchOrders();
    }
    if (updateError) {
      notifyError('Failed to update order');
    }
  }, [updateSuccess, updateError]);

  useEffect(() => {
    if (deleteSuccess) {
      notifySuccess('Order deleted successfully');
      fetchOrders();
    }
    if (deleteError) {
      notifyError('Failed to delete order');
    }
  }, [deleteSuccess, deleteError]);

  const handleUpdateOrder = (orderId: string) => {
    if (!updateData.status && !updateData.paymentStatus && !updateData.deliveryDate && !updateData.feedBack) {
      notifyError('Please select at least one field to update');
      return;
    }
    
    const payload: any = {};
    if (updateData.status) payload.status = updateData.status;
    if (updateData.paymentStatus) payload.paymentStatus = updateData.paymentStatus;
    if (updateData.deliveryDate) payload.deliveryDate = updateData.deliveryDate;
    if (updateData.feedBack) payload.feedBack = updateData.feedBack;
    
    runUpdateOrder(orderId, payload);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      runDeleteOrder(orderId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'text-yellow-600 bg-yellow-100';
      case 'successful': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return <Clock className="w-4 h-4" />;
      case 'successful': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  // Helper function to get customer name/email from order
  const getCustomerInfo = (order) => {
    if (order.user) {
      // If user is an object, extract the email or name
      if (typeof order.user === 'object') {
        return order.user.email || order.user.name || 'User';
      }
      // If user is a string (user ID), return it
      return order.user;
    }
    // Fallback to guest info or 'Guest'
    return order.guestInfo?.email || 'Guest';
  };

  // Helper function to format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  const filteredOrders = ordersData?.orders?.filter(order => {
    const customerInfo = getCustomerInfo(order);
    const matchesSearch = searchTerm === '' || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerInfo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentStatus = paymentStatusFilter === '' || order.paymentStatus === paymentStatusFilter;
    
    return matchesSearch && matchesPaymentStatus;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Management</h1>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Order ID, User, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-900 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-900 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="successful">Successful</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
            
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-900 focus:border-transparent"
            >
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {ordersLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getCustomerInfo(order)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            <span className="ml-1 capitalize">{order.orderStatus}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Not set'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                            <span className="truncate">
                              {order.feedBack ? order.feedBack : 'No feedback'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setUpdateData({ 
                                  status: order.orderStatus, 
                                  paymentStatus: order.paymentStatus,
                                  deliveryDate: formatDateForInput(order.deliveryDate),
                                  feedBack: order.feedBack || ''
                                });
                                setShowUpdateModal(true);
                              }}
                              className="text-amber-800 hover:text-amber-900"
                              title="Edit Order"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={deleteLoading}
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {ordersData && ordersData.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, ordersData.pages))}
                      disabled={currentPage === ordersData.pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 10, ordersData.total)}</span> of{' '}
                        <span className="font-medium">{ordersData.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: ordersData.pages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-amber-900 border-amber-900 text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order ID</label>
                      <p className="mt-1 text-sm text-gray-900">#{selectedOrder._id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer</label>
                      <p className="mt-1 text-sm text-gray-900">{getCustomerInfo(selectedOrder)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="mt-1 text-sm text-gray-900">₦{selectedOrder.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Fee</label>
                      <p className="mt-1 text-sm text-gray-900">₦{selectedOrder.deliveryFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {getStatusIcon(selectedOrder.orderStatus)}
                        <span className="ml-1 capitalize">{selectedOrder.orderStatus}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date Created</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.paymentMethod === 'transfer' && selectedOrder.proofOfPayment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Payment</label>
                    <img 
                      src={selectedOrder.proofOfPayment} 
                      alt="Proof of payment" 
                      className='max-w-xs h-auto rounded-lg border border-gray-300'
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.address}</p>
                </div>
                
                {selectedOrder.feedBack && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Feedback</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedOrder.feedBack}</p>
                    </div>
                  </div>
                )}
                
                {selectedOrder.orderNote && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Note</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedOrder.orderNote}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Items</label>
                  <div className="mt-2 space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Unit Price: ₦{item.product.price.toLocaleString()}</p>
                        </div>
                        <p className="font-medium text-lg">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Order Modal */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Update Order</h3>
                <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder._id.slice(-8)}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                  >
                    <option value="">Keep current status</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="successful">Successful</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                  <select
                    value={updateData.paymentStatus}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                  >
                    <option value="">Keep current status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
                  <input
                    type="date"
                    value={updateData.deliveryDate}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Feedback</label>
                  <textarea
                    value={updateData.feedBack}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, feedBack: e.target.value }))}
                    rows={4}
                    placeholder="Add feedback for the customer..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-900 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateOrder(selectedOrder._id)}
                  disabled={updateLoading}
                  className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 disabled:opacity-50"
                >
                  {updateLoading ? 'Updating...' : 'Update Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}