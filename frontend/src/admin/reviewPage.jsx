import { useEffect, useState } from "react";
import axios from "axios";
import { FiCheckCircle, FiXCircle, FiStar, FiUser, FiMail, FiMessageSquare, FiTrash2, FiAlertTriangle } from "react-icons/fi";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        (async () => {
            if (token) {
                try {
                    const response = await axios.get("http://localhost:5000/api/review/", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    const data = response.data;
                    const reviewsList = Array.isArray(data) ? data : (data && data.reviews) ? data.reviews : [];
                    setReviews(reviewsList);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error("You must be logged in first.");
                setLoading(false);
            }
        })();
    }, [token, refreshToggle]);

    async function approveReview(email) {
        if (!token) return console.error("You must be logged in first.");
        try {
            await axios.put(`http://localhost:5000/api/review/approve/${email}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRefreshToggle(v => !v);
        } catch (err) {
            console.error("Failed to approve review:", err);
        }
    }

    async function deleteReview(email) {
        if (!token) return console.error("You must be logged in first.");
        setDeleting(true);
        try {
            await axios.delete(`http://localhost:5000/api/review/${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRefreshToggle(v => !v);
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Failed to delete review:", err);
        } finally {
            setDeleting(false);
        }
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

    function renderStars(rating) {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    }

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch = !searchQuery ||
            review.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            review.email?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchQuery.trim().toLowerCase());

        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'approved' && review.isApproved) ||
            (filterStatus === 'pending' && !review.isApproved);

        return matchesSearch && matchesFilter;
    });

    // Stats calculations
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(r => r.isApproved).length;
    const pendingReviews = reviews.filter(r => !r.isApproved).length;
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) 
        : 0;

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative mb-8">
                    <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                        Reviews Management
                    </h1>
                    <p className="text-center text-gray-500 mt-2">Manage and moderate customer reviews</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
                                <p className="text-2xl font-bold text-gray-800">{totalReviews}</p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <FiMessageSquare className="text-indigo-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Approved</p>
                                <p className="text-2xl font-bold text-green-600">{approvedReviews}</p>
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
                                <p className="text-2xl font-bold text-amber-600">{pendingReviews}</p>
                            </div>
                            <div className="bg-amber-100 p-3 rounded-full">
                                <FiXCircle className="text-amber-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Avg. Rating</p>
                                <p className="text-2xl font-bold text-yellow-600">{averageRating} ⭐</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <FiStar className="text-yellow-600 text-xl" />
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
                                    placeholder="Search by name, email, or comment..."
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
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="p-4">
                        {loading ? (
                            <div className="text-center py-16 text-gray-500">
                                <div className="flex flex-col items-center gap-4">
                                    <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    <div className="text-sm font-medium">Loading reviews...</div>
                                </div>
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <FiMessageSquare className="text-gray-400 text-3xl" />
                                </div>
                                <p className="text-gray-500 font-medium">No reviews found</p>
                                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredReviews.map((review) => (
                                    <div key={review.email} className="bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all hover:border-indigo-200">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Profile Picture */}
                                            <div className="flex-shrink-0">
                                                {review.profilePicture ? (
                                                    <img
                                                        src={review.profilePicture}
                                                        alt={review.name}
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                                        {review.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Review Content */}
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                                            <FiUser className="text-gray-400" />
                                                            {review.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <FiMail className="text-gray-400" />
                                                            {review.email}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {renderStars(review.rating)}
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                            review.isApproved
                                                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                                                                : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            {review.isApproved ? '✓ Approved' : '⏳ Pending'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Comment */}
                                                <div className="bg-white rounded-lg p-3 border border-gray-100 mb-3">
                                                    <p className="text-gray-700 text-sm leading-relaxed">"{review.comment}"</p>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                    <span className="text-xs text-gray-400">
                                                        Submitted on {formatDate(review.date)}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        {!review.isApproved && (
                                                            <button
                                                                onClick={() => approveReview(review.email)}
                                                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-all hover:shadow"
                                                            >
                                                                <FiCheckCircle /> Approve
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setDeleteConfirm(review)}
                                                            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-all hover:shadow"
                                                        >
                                                            <FiTrash2 /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Header with warning icon */}
                        <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-center">
                            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                <FiAlertTriangle className="text-white text-3xl" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Delete Review</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-700 font-medium mb-2">Are you sure you want to delete this review?</p>
                                <p className="text-gray-500 text-sm">This action cannot be undone.</p>
                            </div>

                            {/* Review Info Card */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    {deleteConfirm.profilePicture ? (
                                        <img src={deleteConfirm.profilePicture} alt={deleteConfirm.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {deleteConfirm.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-800">{deleteConfirm.name}</p>
                                        <p className="text-xs text-gray-500">{deleteConfirm.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(deleteConfirm.rating)}
                                </div>
                                <p className="text-sm text-gray-600 italic">"{deleteConfirm.comment?.substring(0, 100)}{deleteConfirm.comment?.length > 100 ? '...' : ''}"</p>
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
                                    onClick={() => deleteReview(deleteConfirm.email)}
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
                                            <FiTrash2 /> Delete Review
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