import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiPackage, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiEye, FiX, FiShoppingBag, FiDollarSign, FiTruck, FiFilter, FiSearch, FiStar } from 'react-icons/fi';

export default function Gallery() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewOrder, setReviewOrder] = useState(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const navigate = useNavigate();
    // Submit review to backend
    async function handleSubmitReview() {
        if (!reviewRating || !reviewComment) {
            toast.error("Please provide a rating and comment.");
            return;
        }
        setSubmittingReview(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/review/`, {
                rating: reviewRating,
                comment: reviewComment,
                orderId: reviewOrder.orderId || reviewOrder._id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Review submitted! Awaiting admin approval.");
            setShowReviewModal(false);
            setReviewOrder(null);
            setReviewRating(0);
            setReviewComment("");
        } catch (err) {
            toast.error("Failed to submit review.");
        }
        setSubmittingReview(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            toast.error("Please login to view your orders");
            navigate('/login');
            return;
        }

        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(res.data.orders || res.data || []);
            setLoading(false);
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again");
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                toast.error("Failed to load orders");
            }
            setLoading(false);
        }
    };

    const getStatusConfig = (order) => {
        if (order.isRejected) {
            return { 
                label: 'Rejected', 
                color: 'bg-red-500/20 text-red-400 border-red-500/30',
                icon: FiXCircle,
                dotColor: 'bg-red-400'
            };
        }
        if (order.isApproved) {
            return { 
                label: 'Approved', 
                color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                icon: FiCheckCircle,
                dotColor: 'bg-emerald-400'
            };
        }
        return { 
            label: 'Pending', 
            color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            icon: FiAlertCircle,
            dotColor: 'bg-amber-400 animate-pulse'
        };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredOrders = orders.filter(order => {
        // Status filter
        if (filter === "pending" && (order.isApproved || order.isRejected)) return false;
        if (filter === "approved" && !order.isApproved) return false;
        if (filter === "rejected" && !order.isRejected) return false;
        
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return order.orderId?.toLowerCase().includes(query) ||
                    order.orderItems?.some(item =>
                        item.product?.key?.toLowerCase().includes(query) ||
                        item.product?.name?.toLowerCase().includes(query)
                    );
        }
        return true;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => !o.isApproved && !o.isRejected).length,
        approved: orders.filter(o => o.isApproved).length,
        rejected: orders.filter(o => o.isRejected).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 animate-pulse">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                        <FiShoppingBag className="text-indigo-400" />
                        <span className="text-indigo-400 text-sm font-medium">My Orders</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Order <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">History</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Track and manage all your equipment rental orders in one place
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <FiPackage className="text-white" />
                            </div>
                            <span className="text-gray-400 text-sm">Total Orders</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                <FiClock className="text-white" />
                            </div>
                            <span className="text-gray-400 text-sm">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-amber-400">{stats.pending}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <FiCheckCircle className="text-white" />
                            </div>
                            <span className="text-gray-400 text-sm">Approved</span>
                        </div>
                        <p className="text-3xl font-bold text-emerald-400">{stats.approved}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                                <FiXCircle className="text-white" />
                            </div>
                            <span className="text-gray-400 text-sm">Rejected</span>
                        </div>
                        <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by order ID or product..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-gray-400" />
                            {[
                                { value: 'all', label: 'All' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'approved', label: 'Approved' },
                                { value: 'rejected', label: 'Rejected' }
                            ].map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        filter === f.value
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-slate-700/50 border border-slate-600 rounded-full flex items-center justify-center">
                            <FiPackage className="text-4xl text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">No Orders Found</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            {orders.length === 0 
                                ? "You haven't placed any orders yet. Start exploring our equipment!"
                                : "No orders match your current filters."
                            }
                        </p>
                        <button 
                            onClick={() => navigate('/items')}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
                        >
                            <FiShoppingBag />
                            Browse Equipment
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const status = getStatusConfig(order);
                            const StatusIcon = status.icon;
                            const canReview = status.label === 'Approved';
                            return (
                                <div 
                                    key={order.orderId || order._id}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                                                <FiPackage className="text-indigo-400 text-2xl" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-semibold text-white">
                                                        Order #{order.orderId || order._id?.slice(-8)}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></span>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <FiCalendar className="text-indigo-400" />
                                                        {formatDate(order.startingDate)} - {formatDate(order.endingDate)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiClock />
                                                        {order.days} day{order.days !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiShoppingBag />
                                                        {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex items-center gap-4 lg:gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                                    ${order.totalAmount?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-4 py-2 bg-slate-700/50 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-xl transition-all flex items-center gap-2"
                                            >
                                                <FiEye />
                                                <span className="hidden sm:inline">View Details</span>
                                            </button>
                                            {canReview && (
                                                <button
                                                    onClick={() => { setReviewOrder(order); setShowReviewModal(true); }}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all flex items-center gap-2"
                                                >
                                                    <FiStar />
                                                    <span className="hidden sm:inline">Add Review</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                                        <div className="flex flex-wrap gap-2">
                                            {order.orderItems?.slice(0, 4).map((item, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-slate-700/50 text-gray-300 text-sm rounded-lg"
                                                >
                                                    {item.product?.name || item.product?.key} × {item.quantity}
                                                </span>
                                            ))}
                                            {order.orderItems?.length > 4 && (
                                                <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 text-sm rounded-lg">
                                                    +{order.orderItems.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                                {/* Review Modal */}
                                {showReviewModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full p-8 text-center relative animate-fadeInUp">
                                            <FiStar className="mx-auto text-4xl text-emerald-400 mb-4 animate-pulse" />
                                            <h3 className="text-xl font-bold text-white mb-2">Add a Review</h3>
                                            <p className="text-gray-400 mb-6">Share your experience for this order. Your review will be visible after admin approval.</p>
                                            <div className="flex flex-col gap-4 mb-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {[1,2,3,4,5].map(star => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewRating(star)}
                                                            className={star <= reviewRating ? "text-emerald-400" : "text-gray-500"}
                                                        >
                                                            <FiStar className="text-2xl" />
                                                        </button>
                                                    ))}
                                                </div>
                                                <textarea
                                                    value={reviewComment}
                                                    onChange={e => setReviewComment(e.target.value)}
                                                    rows={4}
                                                    placeholder="Write your review..."
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                            </div>
                                            <div className="flex gap-4 justify-center">
                                                <button
                                                    onClick={handleSubmitReview}
                                                    disabled={submittingReview}
                                                    className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
                                                >
                                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                                </button>
                                                <button
                                                    onClick={() => { setShowReviewModal(false); setReviewOrder(null); setReviewRating(0); setReviewComment(""); }}
                                                    className="px-6 py-3 rounded-xl font-semibold bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <style>{`
                                    @keyframes fadeInUp {
                                        from { opacity: 0; transform: translateY(30px); }
                                        to { opacity: 1; transform: translateY(0); }
                                    }
                                    .animate-fadeInUp {
                                        animation: fadeInUp 0.4s ease-out forwards;
                                    }
                                `}</style>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Order #{selectedOrder.orderId || selectedOrder._id?.slice(-8)}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Placed on {formatDate(selectedOrder.orderDate || selectedOrder.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* Status */}
                            <div className="mb-6">
                                {(() => {
                                    const status = getStatusConfig(selectedOrder);
                                    const StatusIcon = status.icon;
                                    return (
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${status.color}`}>
                                            <StatusIcon />
                                            <span className="font-medium">{status.label}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Rental Period */}
                            <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
                                <h4 className="text-gray-400 text-sm mb-3">Rental Period</h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                        <p className="text-white font-medium">{formatDate(selectedOrder.startingDate)}</p>
                                    </div>
                                    <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">End Date</p>
                                        <p className="text-white font-medium">{formatDate(selectedOrder.endingDate)}</p>
                                    </div>
                                    <div className="px-4 py-2 bg-indigo-500/20 rounded-lg">
                                        <p className="text-indigo-400 font-bold">{selectedOrder.days} Days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-6">
                                <h4 className="text-gray-400 text-sm mb-3">Order Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems?.map((item, idx) => (
                                        <div 
                                            key={idx}
                                            className="flex items-center justify-between bg-slate-700/30 rounded-xl p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.product?.image ? (
                                                    <img 
                                                        src={item.product.image} 
                                                        alt={item.product.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                                                        <FiPackage className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium">{item.product?.name || item.product?.key}</p>
                                                    <p className="text-gray-500 text-sm">Qty: {item.quantity} × ${item.product?.price?.toFixed(2)}/day</p>
                                                </div>
                                            </div>
                                            <p className="text-indigo-400 font-semibold">
                                                ${((item.product?.price || 0) * item.quantity).toFixed(2)}/day
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Total Amount</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                        ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-700">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}