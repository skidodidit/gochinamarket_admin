"use client"

import { useState, useEffect } from 'react';
import { Search, Package, Clock, CheckCircle, XCircle, Truck, Calendar, User, MapPin, CreditCard, Phone } from 'lucide-react';
import { getAdminOrders, updateOrderStatus, verifyDeliveryCode } from '@/lib/api/order';
import { Order, OrderStatus } from '@/types';
import { useApi } from '@/hooks/useApi';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deliveryCode, setDeliveryCode] = useState('');

  const { loading, error, run: runGetOrders } = useApi(getAdminOrders);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdateStatus } = useApi(updateOrderStatus);
  const { loading: verifyLoading, error: verifyError, success: verifySuccess, run: runVerifyCode } = useApi(verifyDeliveryCode);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    const result = await runGetOrders({ page, limit: 10, search, status: statusFilter });
    if (result) {
      setOrders(result.orders);
      setTotal(result.total);
      setPages(result.pages);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    const result = await runUpdateStatus(id, status);
    if (result) {
      fetchOrders();
      setSelectedOrder(null);
    }
  };

  const handleVerifyDelivery = async () => {
    if (!selectedOrder || !deliveryCode) return;
    const result = await runVerifyCode(selectedOrder._id, deliveryCode);
    if (result) {
      fetchOrders();
      setDeliveryCode('');
      setSelectedOrder(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <Package className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status];
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN' 
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <Package className="w-10 h-10 text-black" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <XCircle className="w-12 h-12 mx-auto mb-4" />
              <p>Error loading orders: {error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <p>No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{order.address.name}</div>
                            <div className="text-gray-500">{order.address.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{order.items.length} items</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-primary hover:text-black font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {page} of {pages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                  <span className="text-sm text-gray-500">Order #{selectedOrder._id.slice(-8)}</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.address.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.address.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-600">Address:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}, {selectedOrder.address.country}
                          {selectedOrder.address.postalCode && ` - ${selectedOrder.address.postalCode}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <span className="text-sm font-medium text-gray-900 uppercase">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <span className={`text-sm font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="text-sm text-gray-900">{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Shipping:</span>
                        <span className="text-sm text-gray-900">{formatCurrency(selectedOrder.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-base font-semibold text-gray-900">Total:</span>
                        <span className="text-base font-bold text-gray-900">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Code Section */}
                {selectedOrder.status === 'shipped' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Verify Delivery</h3>
                    <div className="bg-primary/20 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-gray-600">Enter the delivery code provided by the customer to confirm delivery.</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter delivery code"
                          value={deliveryCode}
                          onChange={(e) => setDeliveryCode(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          onClick={handleVerifyDelivery}
                          disabled={verifyLoading || !deliveryCode}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          {verifyLoading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                      {verifyError && <p className="text-sm text-red-600">{verifyError}</p>}
                      {verifySuccess && <p className="text-sm text-green-600">Delivery verified successfully!</p>}
                    </div>
                  </div>
                )}

                {/* Update Status */}
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Order Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(selectedOrder._id, 'confirmed')}
                            disabled={updateLoading}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/60 disabled:opacity-50 font-medium"
                          >
                            Confirm Order
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                            disabled={updateLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {selectedOrder.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedOrder._id, 'shipped')}
                          disabled={updateLoading}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
                        >
                          Mark as Shipped
                        </button>
                      )}
                    </div>
                    {updateError && <p className="text-sm text-red-600 mt-2">{updateError}</p>}
                    {updateSuccess && <p className="text-sm text-green-600 mt-2">Status updated successfully!</p>}
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.deliveredAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Delivered: {formatDate(selectedOrder.deliveredAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;