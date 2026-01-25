import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
    FiPackage, FiUsers, FiDollarSign, FiStar, FiTrendingUp, FiTrendingDown,
    FiCheckCircle, FiClock, FiXCircle, FiCalendar, FiArrowRight, FiActivity,
    FiShoppingBag, FiUserCheck, FiMessageSquare, FiAlertCircle
} from "react-icons/fi";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalBookings: 0,
        approvedBookings: 0,
        pendingBookings: 0,
        rejectedBookings: 0,
        totalRevenue: 0,
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        totalItems: 0,
        availableItems: 0,
        totalReviews: 0,
        approvedReviews: 0,
        pendingReviews: 0,
        averageRating: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Fetch all data in parallel
            const [ordersRes, usersRes, productsRes, reviewsRes] = await Promise.all([
                axios.get("http://localhost:5000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { orders: [] } })),
                axios.get("http://localhost:5000/api/users/users", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] })),
                axios.get("http://localhost:5000/api/product", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] })),
                axios.get("http://localhost:5000/api/review", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] }))
            ]);

            // Process orders data
            const orders = ordersRes.data?.orders || ordersRes.data || [];
            const approvedOrders = orders.filter(o => o.isApproved && !o.isRejected);
            const pendingOrders = orders.filter(o => !o.isApproved && !o.isRejected);
            const rejectedOrders = orders.filter(o => o.isRejected);
            const totalRevenue = approvedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            // Process users data
            const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.users || [];
            const activeUsers = users.filter(u => !u.blocked);
            const blockedUsers = users.filter(u => u.blocked);

            // Process products data
            const products = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.products || [];
            const availableProducts = products.filter(p => p.availability !== false);

            // Process reviews data
            const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : reviewsRes.data?.reviews || [];
            const approvedReviews = reviews.filter(r => r.isApproved);
            const pendingReviews = reviews.filter(r => !r.isApproved);
            const avgRating = reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
                : 0;

            setStats({
                totalBookings: orders.length,
                approvedBookings: approvedOrders.length,
                pendingBookings: pendingOrders.length,
                rejectedBookings: rejectedOrders.length,
                totalRevenue,
                totalUsers: users.length,
                activeUsers: activeUsers.length,
                blockedUsers: blockedUsers.length,
                totalItems: products.length,
                availableItems: availableProducts.length,
                totalReviews: reviews.length,
                approvedReviews: approvedReviews.length,
                pendingReviews: pendingReviews.length,
                averageRating: avgRating
            });

            // Get recent bookings (last 5)
            setRecentBookings(orders.slice(-5).reverse());
            
            // Get recent reviews (last 5)
            setRecentReviews(reviews.slice(-5).reverse());

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function renderStars(rating) {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        className={`w-3 h-3 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your audio rental business.</p>
                </div>

                {/* Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg shadow-green-500/30">
                                <FiDollarSign className="text-white text-2xl" />
                            </div>
                            <span className="flex items-center text-green-500 text-sm font-medium">
                                <FiTrendingUp className="mr-1" /> +12.5%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-xs text-gray-400 mt-2">From {stats.approvedBookings} approved bookings</p>
                    </div>

                    {/* Total Bookings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                                <FiPackage className="text-white text-2xl" />
                            </div>
                            <span className="flex items-center text-indigo-500 text-sm font-medium">
                                <FiActivity className="mr-1" /> Active
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalBookings}</p>
                        <div className="flex gap-3 mt-2">
                            <span className="text-xs text-green-500">{stats.approvedBookings} approved</span>
                            <span className="text-xs text-amber-500">{stats.pendingBookings} pending</span>
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                                <FiUsers className="text-white text-2xl" />
                            </div>
                            <span className="flex items-center text-blue-500 text-sm font-medium">
                                <FiUserCheck className="mr-1" /> {stats.activeUsers} active
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
                        <p className="text-xs text-gray-400 mt-2">{stats.blockedUsers} blocked users</p>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl shadow-lg shadow-yellow-500/30">
                                <FiStar className="text-white text-2xl" />
                            </div>
                            <span className="flex items-center text-yellow-500 text-sm font-medium">
                                <FiMessageSquare className="mr-1" /> {stats.totalReviews} reviews
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageRating} ⭐</p>
                        <p className="text-xs text-gray-400 mt-2">{stats.pendingReviews} pending approval</p>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                        <div className="flex items-center gap-3">
                            <FiCheckCircle className="text-green-500 text-xl" />
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.approvedBookings}</p>
                                <p className="text-xs text-green-600/70">Approved Bookings</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
                        <div className="flex items-center gap-3">
                            <FiClock className="text-amber-500 text-xl" />
                            <div>
                                <p className="text-2xl font-bold text-amber-600">{stats.pendingBookings}</p>
                                <p className="text-xs text-amber-600/70">Pending Bookings</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                        <div className="flex items-center gap-3">
                            <FiXCircle className="text-red-500 text-xl" />
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats.rejectedBookings}</p>
                                <p className="text-xs text-red-600/70">Rejected Bookings</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-3">
                            <FiShoppingBag className="text-purple-500 text-xl" />
                            <div>
                                <p className="text-2xl font-bold text-purple-600">{stats.availableItems}</p>
                                <p className="text-xs text-purple-600/70">Available Items</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                            <div>
                                <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
                                <p className="text-xs text-gray-500">Latest customer orders</p>
                            </div>
                            <Link to="/adminPage/booking" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                                View All <FiArrowRight />
                            </Link>
                        </div>
                        <div className="p-4">
                            {recentBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <FiPackage className="mx-auto text-gray-300 text-4xl mb-2" />
                                    <p className="text-gray-500 text-sm">No bookings yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentBookings.map((booking) => (
                                        <div key={booking.orderId} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    booking.isRejected 
                                                        ? 'bg-red-100 text-red-600'
                                                        : booking.isApproved 
                                                            ? 'bg-green-100 text-green-600' 
                                                            : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                    {booking.isRejected ? <FiXCircle /> : booking.isApproved ? <FiCheckCircle /> : <FiClock />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">{booking.orderId}</p>
                                                    <p className="text-xs text-gray-500">{booking.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">{formatCurrency(booking.totalAmount)}</p>
                                                <p className="text-xs text-gray-500">{formatDate(booking.orderDate)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                            <div>
                                <h2 className="font-semibold text-gray-800">Recent Reviews</h2>
                                <p className="text-xs text-gray-500">Latest customer feedback</p>
                            </div>
                            <Link to="/adminPage/reviews" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                                View All <FiArrowRight />
                            </Link>
                        </div>
                        <div className="p-4">
                            {recentReviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <FiMessageSquare className="mx-auto text-gray-300 text-4xl mb-2" />
                                    <p className="text-gray-500 text-sm">No reviews yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentReviews.map((review) => (
                                        <div key={review.email} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {review.profilePicture ? (
                                                        <img src={review.profilePicture} alt={review.name} className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                            {review.name?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">{review.name}</p>
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    review.isApproved 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {review.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/adminPage/booking" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-md transition-all hover:scale-105">
                            <FiPackage className="text-indigo-600 text-2xl mb-2" />
                            <span className="text-sm font-medium text-gray-700">Manage Bookings</span>
                            {stats.pendingBookings > 0 && (
                                <span className="mt-1 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">{stats.pendingBookings} pending</span>
                            )}
                        </Link>
                        <Link to="/adminPage/items" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-all hover:scale-105">
                            <FiShoppingBag className="text-green-600 text-2xl mb-2" />
                            <span className="text-sm font-medium text-gray-700">Manage Items</span>
                            <span className="mt-1 text-xs text-gray-500">{stats.totalItems} products</span>
                        </Link>
                        <Link to="/adminPage/users" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-md transition-all hover:scale-105">
                            <FiUsers className="text-blue-600 text-2xl mb-2" />
                            <span className="text-sm font-medium text-gray-700">Manage Users</span>
                            <span className="mt-1 text-xs text-gray-500">{stats.totalUsers} users</span>
                        </Link>
                        <Link to="/adminPage/reviews" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:shadow-md transition-all hover:scale-105">
                            <FiStar className="text-yellow-600 text-2xl mb-2" />
                            <span className="text-sm font-medium text-gray-700">Manage Reviews</span>
                            {stats.pendingReviews > 0 && (
                                <span className="mt-1 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">{stats.pendingReviews} pending</span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Alerts Section */}
                {(stats.pendingBookings > 0 || stats.pendingReviews > 0) && (
                    <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
                        <div className="flex items-start gap-3">
                            <FiAlertCircle className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-800">Attention Required</h3>
                                <ul className="mt-2 space-y-1">
                                    {stats.pendingBookings > 0 && (
                                        <li className="text-sm text-amber-700">
                                            • You have <span className="font-semibold">{stats.pendingBookings} pending booking(s)</span> waiting for approval
                                        </li>
                                    )}
                                    {stats.pendingReviews > 0 && (
                                        <li className="text-sm text-amber-700">
                                            • You have <span className="font-semibold">{stats.pendingReviews} pending review(s)</span> waiting for moderation
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}