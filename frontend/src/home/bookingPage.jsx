import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadCart, clearCart } from "../utils/cart";
import BookingItem from "../components/bookingItem";
import { toast } from "react-hot-toast";
import { FiShoppingCart, FiCalendar, FiDollarSign, FiTrash2, FiPlus, FiCheck, FiPackage, FiClock, FiPercent, FiShield, FiTruck, FiHeadphones, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export default function BookingPage() {
    const [cart, setCart] = useState(loadCart());
    const [itemPrices, setItemPrices] = useState({});
    const [loadingPrices, setLoadingPrices] = useState(cart.orderedItems.length > 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();

    // Fetch prices for all items in cart
    useEffect(() => {
        async function fetchPrices() {
            const prices = {};
            setLoadingPrices(true);
            
            for (const item of cart.orderedItems) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${item.key}`);
                    if (res.data.product) {
                        prices[item.key] = res.data.product.price;
                    }
                } catch (err) {
                    console.error(`Failed to fetch price for ${item.key}`);
                }
            }
            
            setItemPrices(prices);
            setLoadingPrices(false);
        }
        
        if (cart.orderedItems.length > 0) {
            fetchPrices();
        }
    }, [cart.orderedItems.length]);

    function reloadCart() {
        setCart(loadCart());
    }

    function handleClearCart() {
        clearCart();
        reloadCart();
        setItemPrices({});
        toast.success("Cart cleared");
    }

    function updateDates(startDate, endDate) {
        const updatedCart = loadCart();
        updatedCart.startingDate = startDate;
        updatedCart.endingDate = endDate;
        
        // Calculate days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        updatedCart.days = diffDays;
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
    }

    const totalItems = cart.orderedItems.reduce((sum, item) => sum + item.qty, 0);
    
    // Calculate total price
    const subtotal = cart.orderedItems.reduce((sum, item) => {
        const price = itemPrices[item.key] || 0;
        return sum + (price * item.qty);
    }, 0);
    
    const totalPrice = subtotal * cart.days;

    function handleBookingCreation() {
        setShowConfirmModal(true);
    }

    function confirmBooking() {
        setShowConfirmModal(false);
        const currentCart = loadCart();
        setIsSubmitting(true);

        // Transform cart data to match backend expected format
        const orderData = {
            orderItems: currentCart.orderedItems.map(item => ({
                productKey: item.key,
                quantity: item.qty
            })),
            days: currentCart.days,
            startingDate: currentCart.startingDate,
            endingDate: currentCart.endingDate
        };

        const token = localStorage.getItem('token');
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/create`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            toast.success("Booking created successfully!");
            clearCart();
            window.location.href = '/gallery'; // Redirect to gallery after booking
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || "There was an error creating the booking!");
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    }

    const features = [
        { icon: FiShield, text: 'Secure Payment' },
        { icon: FiTruck, text: 'Free Delivery' },
        { icon: FiClock, text: '24/7 Support' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-12">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Items Header */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <FiPackage className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Cart Items</h2>
                                    <p className="text-sm text-gray-400">{totalItems} item{totalItems !== 1 ? 's' : ''} • {cart.orderedItems.length} product{cart.orderedItems.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            {cart.orderedItems.length > 0 && (
                                <button 
                                    onClick={handleClearCart}
                                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
                                >
                                    <FiTrash2 />
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Cart Items List */}
                        {cart.orderedItems.length > 0 ? (
                            <div className="space-y-4">
                                {cart.orderedItems.map((item) => (
                                    <BookingItem 
                                        key={item.key} 
                                        itemkey={item.key} 
                                        qty={item.qty} 
                                        onRemove={reloadCart}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Empty Cart State */
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-slate-700/50 border border-slate-600 rounded-full flex items-center justify-center">
                                    <FiShoppingCart className="text-4xl text-gray-500" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">Your cart is empty</h3>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                    Looks like you haven't added any equipment yet. Browse our collection and find the perfect audio gear for your event.
                                </p>
                                <button 
                                    onClick={() => navigate('/items')}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                                >
                                    <FiHeadphones className="text-xl" />
                                    Browse Equipment
                                    <FiArrowRight />
                                </button>
                            </div>
                        )}

                        {/* Features */}
                        {cart.orderedItems.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 flex items-center gap-3">
                                        <feature.icon className="text-indigo-400 text-xl" />
                                        <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sticky top-24 space-y-6">
                            {/* Summary Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                    <FiDollarSign className="text-white text-lg" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Order Summary</h2>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-300 mb-2">
                                    <FiCalendar className="text-indigo-400" />
                                    <span className="font-medium">Rental Period</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Date</label>
                                        <input 
                                            type="date" 
                                            value={cart.startingDate}
                                            onChange={(e) => updateDates(e.target.value, cart.endingDate)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">End Date</label>
                                        <input 
                                            type="date" 
                                            value={cart.endingDate}
                                            onChange={(e) => updateDates(cart.startingDate, e.target.value)}
                                            min={cart.startingDate}
                                            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Duration Badge */}
                                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FiClock className="text-indigo-400" />
                                        <span className="text-gray-300 text-sm">Duration</span>
                                    </div>
                                    <span className="text-xl font-bold text-white">{cart.days} <span className="text-sm font-normal text-gray-400">day{cart.days !== 1 ? 's' : ''}</span></span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 py-4 border-t border-b border-slate-700/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Items ({totalItems})</span>
                                    {loadingPrices ? (
                                        <span className="w-16 h-4 bg-slate-700 rounded animate-pulse"></span>
                                    ) : (
                                        <span className="text-gray-300">${subtotal.toFixed(2)}/day</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Rental Period</span>
                                    <span className="text-gray-300">{cart.days} day{cart.days !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Delivery</span>
                                    <span className="text-emerald-400 font-medium">Free</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-300 font-medium">Total Amount</span>
                                    {loadingPrices ? (
                                        <span className="w-24 h-8 bg-slate-700 rounded animate-pulse"></span>
                                    ) : (
                                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 text-right">
                                    ${subtotal.toFixed(2)} × {cart.days} day{cart.days !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleBookingCreation}
                                    disabled={cart.orderedItems.length === 0 || isSubmitting}
                                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                                        cart.orderedItems.length > 0 && !isSubmitting
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30' 
                                            : 'bg-slate-700 cursor-not-allowed text-gray-400'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheck className="text-xl" />
                                            Confirm Booking
                                        </>
                                    )}
                                </button>
                                            {/* Custom Confirmation Modal */}
                                            {showConfirmModal && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                                    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 max-w-sm w-full p-8 text-center relative animate-fadeInUp">
                                                        <FiAlertCircle className="mx-auto text-4xl text-emerald-400 mb-4 animate-pulse" />
                                                        <h3 className="text-xl font-bold text-white mb-2">Confirm Booking</h3>
                                                        <p className="text-gray-400 mb-6">Are you sure you want to confirm this booking? This action cannot be undone.</p>
                                                        <div className="flex gap-4 justify-center">
                                                            <button
                                                                onClick={confirmBooking}
                                                                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
                                                            >
                                                                <FiCheck className="text-lg" /> Yes, Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setShowConfirmModal(false)}
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
                                
                                <button
                                    onClick={() => navigate('/items')}
                                    className="w-full py-3 border border-slate-600 hover:border-indigo-500 rounded-xl font-medium text-gray-300 hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <FiPlus />
                                    Add More Items
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="pt-4 border-t border-slate-700/50">
                                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                                    <FiShield className="text-emerald-400" />
                                    <span>Secure checkout • 100% Money-back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}