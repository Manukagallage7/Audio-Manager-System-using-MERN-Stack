import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiCalendar, FiPackage, FiClock, FiDollarSign, FiMail, FiEye, FiTrash2, FiAlertTriangle } from "react-icons/fi";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/orders", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const data = response.data;
          const orders = Array.isArray(data) ? data : (data && data.orders) ? data.orders : [];
          if (orders) setBookings(orders);
        } catch (err) {
          console.error("Failed to fetch bookings:", err);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("You must be logged in first.");
        setLoading(false);
      }
    })();
  }, [token, refreshToggle]);

  async function approveBooking(orderId) {
    if (!token) return console.error("You must be logged in first.");
    try {
      await axios.put(`http://localhost:5000/api/orders/approve/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefreshToggle(v => !v);
    } catch (err) {
      console.error("Failed to approve booking:", err);
    }
  }

  async function rejectBooking(orderId) {
    if (!token) return console.error("You must be logged in first.");
    try {
      await axios.put(`http://localhost:5000/api/orders/reject/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefreshToggle(v => !v);
    } catch (err) {
      console.error("Failed to reject booking:", err);
    }
  }

  async function deleteBooking(orderId) {
    if (!token) return console.error("You must be logged in first.");
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefreshToggle(v => !v);
      setDeleteConfirm(null);
      setSelectedBooking(null);
    } catch (err) {
      console.error("Failed to delete booking:", err);
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteClick(booking) {
    setDeleteConfirm(booking);
  }

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = !searchQuery || 
      booking.orderId?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.trim().toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'approved' && booking.isApproved && !booking.isRejected) ||
      (filterStatus === 'pending' && !booking.isApproved && !booking.isRejected) ||
      (filterStatus === 'rejected' && booking.isRejected);
    
    return matchesSearch && matchesFilter;
  });

  // Stats calculations
  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter(b => b.isApproved && !b.isRejected).length;
  const pendingBookings = bookings.filter(b => !b.isApproved && !b.isRejected).length;
  const rejectedBookings = bookings.filter(b => b.isRejected).length;
  const totalRevenue = bookings.filter(b => b.isApproved && !b.isRejected).reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Booking Management
          </h1>
          <p className="text-center text-gray-500 mt-2">Manage and track all customer bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{totalBookings}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiPackage className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedBookings}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{pendingBookings}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <FiClock className="text-amber-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedBookings}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FiXCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiDollarSign className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input 
                  value={searchQuery} 
                  onChange={handleSearch} 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                  placeholder="Search by Order ID or Email..." 
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => setFilterStatus('approved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'approved' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilterStatus('rejected')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'rejected' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-4">
            {loading ? (
              <div className="text-center py-16 text-gray-500">
                <div className="flex flex-col items-center gap-4">
                  <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm font-medium">Loading bookings...</div>
                </div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="text-gray-400 text-3xl" />
                </div>
                <p className="text-gray-500 font-medium">No bookings found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-3.5 font-semibold rounded-tl-lg">Order ID</th>
                      <th className="px-4 py-3.5 font-semibold">Customer Email</th>
                      <th className="px-4 py-3.5 font-semibold">Order Placed</th>
                      <th className="px-4 py-3.5 font-semibold">Booking Period</th>
                      <th className="px-4 py-3.5 font-semibold">Days</th>
                      <th className="px-4 py-3.5 font-semibold">Items</th>
                      <th className="px-4 py-3.5 font-semibold">Total</th>
                      <th className="px-4 py-3.5 font-semibold">Status</th>
                      <th className="px-4 py-3.5 font-semibold rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.orderId} className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-colors">
                        <td className="px-4 py-4">
                          <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            {booking.orderId}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FiMail className="text-gray-400" />
                            <span className="text-gray-700">{booking.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-gray-700 text-sm font-medium">
                              {formatDate(booking.orderDate)}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {new Date(booking.orderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-400" />
                            <span className="text-gray-600 text-xs">
                              {formatDate(booking.startingDate)} - {formatDate(booking.endingDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            {booking.days} days
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 text-xs font-medium"
                          >
                            <FiEye /> {booking.orderItems?.length || 0} items
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-gray-800">${booking.totalAmount?.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${
                            booking.isRejected 
                              ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                              : booking.isApproved 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                                : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200'
                          }`}>
                            {booking.isRejected ? (
                              <><FiXCircle /> Rejected</>
                            ) : booking.isApproved ? (
                              <><FiCheckCircle /> Approved</>
                            ) : (
                              <><FiClock /> Pending</>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {booking.isRejected ? (
                            <button 
                              onClick={() => handleDeleteClick(booking)}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-all hover:shadow"
                            >
                              <FiTrash2 /> Delete
                            </button>
                          ) : !booking.isApproved ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => approveBooking(booking.orderId)}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-all hover:shadow"
                              >
                                <FiCheckCircle /> Approve
                              </button>
                              <button 
                                onClick={() => rejectBooking(booking.orderId)}
                                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-all hover:shadow"
                              >
                                <FiXCircle /> Reject
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleDeleteClick(booking)}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-all hover:shadow"
                            >
                              <FiTrash2 /> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <p className="text-indigo-200 text-sm mt-1">Order {selectedBooking.orderId}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Customer Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FiMail className="text-indigo-500" /> Customer Information
                </h3>
                <p className="text-gray-600">{selectedBooking.email}</p>
              </div>

              {/* Booking Period */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FiCalendar className="text-blue-500" /> Booking Period
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="font-medium text-gray-700">{formatDate(selectedBooking.startingDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium text-indigo-600">{selectedBooking.days} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="font-medium text-gray-700">{formatDate(selectedBooking.endingDate)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FiPackage className="text-purple-500" /> Order Items
                </h3>
                <div className="space-y-3">
                  {selectedBooking.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-indigo-200 transition-colors">
                      <img 
                        src={item.product?.image} 
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">Key: {item.product?.key}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-semibold text-indigo-600">${item.product?.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total Amount</span>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    ${selectedBooking.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              {!selectedBooking.isApproved && !selectedBooking.isRejected && (
                <>
                  <button 
                    onClick={() => {
                      approveBooking(selectedBooking.orderId);
                      setSelectedBooking(null);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2 shadow-sm transition-all hover:shadow"
                  >
                    <FiCheckCircle /> Approve Booking
                  </button>
                  <button 
                    onClick={() => {
                      rejectBooking(selectedBooking.orderId);
                      setSelectedBooking(null);
                    }}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2 shadow-sm transition-all hover:shadow"
                  >
                    <FiXCircle /> Reject Booking
                  </button>
                </>
              )}
              {(selectedBooking.isApproved || selectedBooking.isRejected) && (
                <button 
                  onClick={() => handleDeleteClick(selectedBooking)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2 shadow-sm transition-all hover:shadow"
                >
                  <FiTrash2 /> Delete Booking
                </button>
              )}
              <button 
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header with warning icon */}
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FiAlertTriangle className="text-white text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete Booking</h2>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 font-medium mb-2">Are you sure you want to permanently delete this booking?</p>
                <p className="text-gray-500 text-sm">This action cannot be undone.</p>
              </div>
              
              {/* Booking Info Card */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-sm">
                    {deleteConfirm.orderId}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    deleteConfirm.isRejected 
                      ? 'bg-red-100 text-red-700'
                      : deleteConfirm.isApproved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                  }`}>
                    {deleteConfirm.isRejected ? 'Rejected' : deleteConfirm.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMail className="text-gray-400" />
                    <span>{deleteConfirm.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiDollarSign className="text-gray-400" />
                    <span className="font-semibold">${deleteConfirm.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteBooking(deleteConfirm.orderId)}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-3 rounded-xl font-medium inline-flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 /> Delete Forever
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}