import {useEffect, useState} from 'react';
import axios from 'axios';
import {removeFromCart, updateCartQty} from '../utils/cart';

export default function BookingItem(props){
    const {itemkey, qty, onRemove} = props
    const [item, setItem] = useState(null)
    const [status, setStatus] = useState('loading')
    const [currentQty, setCurrentQty] = useState(qty)

    useEffect(() => {
        if (status === 'loading') {
            const fetchItem = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${itemkey}`)
                    setItem(res.data.product)
                    setStatus('loaded')
                } catch (err) {
                    console.error("Error fetching item data:", err)
                    setStatus('error')
                    removeFromCart(itemkey)
                }
            }
            fetchItem()
        }
    }, [status, itemkey])

    const handleRemove = () => {
        removeFromCart(itemkey)
        if (onRemove) onRemove(itemkey)
    }

    const handleIncrement = () => {
        const newQty = currentQty + 1
        setCurrentQty(newQty)
        updateCartQty(itemkey, newQty)
        if (onRemove) onRemove() // Refresh cart state in parent
    }

    const handleDecrement = () => {
        if (currentQty > 1) {
            const newQty = currentQty - 1
            setCurrentQty(newQty)
            updateCartQty(itemkey, newQty)
            if (onRemove) onRemove() // Refresh cart state in parent
        } else {
            handleRemove()
        }
    }

    // Loading state
    if (status === 'loading') {
        return (
            <div className="w-full bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (status === 'error' || !item) {
        return (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3 text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Item not found - removed from cart</span>
                </div>
            </div>
        )
    }

    return(
        <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="flex gap-4 p-4">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.image?.[0] ? (
                        <img 
                            src={item.image[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                        {item.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {item.description}
                    </p>

                    {/* Product Key */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">ID:</span>
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {item.key}
                        </span>
                    </div>
                </div>

                {/* Price & Quantity Section */}
                <div className="flex flex-col items-end justify-between">
                    {/* Price */}
                    <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">${item.price}</p>
                        <p className="text-xs text-gray-400">per unit</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={handleDecrement}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors font-bold text-lg"
                        >
                            −
                        </button>
                        <span className="w-10 text-center bg-blue-100 text-blue-700 font-semibold py-1 rounded-lg text-sm">
                            {currentQty}
                        </span>
                        <button 
                            onClick={handleIncrement}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-600 transition-colors font-bold text-lg"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Total & Remove */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Subtotal:</span>
                    <span className="text-lg font-bold text-green-600">
                        ${(item.price * currentQty).toFixed(2)}
                    </span>
                </div>
                
                <button 
                    onClick={handleRemove}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                </button>
            </div>
        </div>
    )
}