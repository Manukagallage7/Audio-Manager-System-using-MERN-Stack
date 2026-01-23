import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {loadCart, clearCart} from "../utils/cart";
import BookingItem from "../components/bookingItem";
import {toast} from "react-hot-toast";

export default function BookingPage() {
    const [cart, setCart] = useState(loadCart());
    const [itemPrices, setItemPrices] = useState({});
    const [loadingPrices, setLoadingPrices] = useState(cart.orderedItems.length > 0);
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

    function reloadCart(){
        setCart(loadCart()) 
    }

    function handleClearCart(){
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
        const currentCart = loadCart()

        // Transform cart data to match backend expected format
        const orderData = {
            orderItems: currentCart.orderedItems.map(item => ({
                productKey: item.key,
                quantity: item.qty
            })),
            days: currentCart.days,
            startingDate: currentCart.startingDate,
            endingDate: currentCart.endingDate
        }

        const token = localStorage.getItem('token')
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/create`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            toast.success("Booking created successfully!")
            clearCart()
            navigate('/homePage')
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || "There was an error creating the booking!")
        });

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Booking Cart</h1>
                    <p className="text-gray-500">Review your items and schedule your rental</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2 space-y-2">
                        {/* Items Header */}
                        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">Cart Items</h2>
                                    <p className="text-sm text-gray-500">{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
                                </div>
                            </div>
                            {cart.orderedItems.length > 0 && (
                                <button 
                                    onClick={handleClearCart}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
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
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                                <button 
                                    onClick={() => navigate('/homePage/items')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Browse Items
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-4 min-h-[550px] w-full">
                            {/* Two Column Layout - Date & Price */}
                            <div className="grid grid-cols-2 gap-6 mb-2">
                                {/* Left - Date Details */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-base font-semibold text-gray-800">Dates</span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Start Date</label>
                                        <input 
                                            type="date" 
                                            value={cart.startingDate}
                                            onChange={(e) => updateDates(e.target.value, cart.endingDate)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">End Date</label>
                                        <input 
                                            type="date" 
                                            value={cart.endingDate}
                                            onChange={(e) => updateDates(cart.startingDate, e.target.value)}
                                            min={cart.startingDate}
                                            className="w-full px-3 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                                        <span className="text-2xl font-bold text-blue-600">{cart.days}</span>
                                        <span className="text-sm text-gray-500 ml-2">day{cart.days !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                {/* Right - Price Details */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-base font-semibold text-gray-800">Price</span>
                                    </div>
                                    <div className="flex justify-between text-base py-2">
                                        <span className="text-gray-500">Items</span>
                                        <span className="font-semibold text-gray-800">{totalItems}</span>
                                    </div>
                                    <div className="flex justify-between text-base py-2">
                                        <span className="text-gray-500">Products</span>
                                        <span className="font-semibold text-gray-800">{cart.orderedItems.length}</span>
                                    </div>
                                    <div className="flex justify-between text-base py-2">
                                        <span className="text-gray-500">Per day</span>
                                        {loadingPrices ? (
                                            <span className="w-16 h-5 bg-gray-200 rounded animate-pulse"></span>
                                        ) : (
                                            <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 text-center mt-4">
                                        <p className="text-sm text-gray-500 mb-2">Total</p>
                                        {loadingPrices ? (
                                            <span className="w-24 h-8 bg-gray-200 rounded animate-pulse mx-auto block"></span>
                                        ) : (
                                            <span className="text-3xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
                                        )}
                                        <p className="text-sm text-gray-400 mt-2">
                                            ${subtotal.toFixed(2)} × {cart.days} day{cart.days !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons - Bottom Center */}
                            <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-100">
                                <button
                                onClick={handleBookingCreation}
                                    disabled={cart.orderedItems.length === 0}
                                    className={`w-full py-4 rounded-xl font-semibold text-lg text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                                        cart.orderedItems.length > 0
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl' 
                                            : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirm Booking
                                </button>
                                <button
                                    onClick={() => navigate('/homePage/items')}
                                    className="w-full py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-base text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add More Items
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}