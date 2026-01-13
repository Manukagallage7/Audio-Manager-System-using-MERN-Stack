import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Items() {
    const [state, setState] = useState("loading") //  loading, success, error
    const [products, setProducts] = useState([])

    useEffect(() => {
        if(state === "loading"){
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`)
            .then(res => {
                setProducts(res.data.products || []);
                setState("success");
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "There was an error fetching the products!");
                setState("error");
            });
        }
    }, [state])
    return (
        <div className="w-full h-full flex-wrap justify-center pt-4">
            {state === "loading" &&
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-gray-600 text-lg animate-pulse">Loading products...</p>
            </div>
            }
            {state === "error" &&
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4">
                <div className="relative">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Oops! Something went wrong</h3>
                <p className="text-gray-500 text-center max-w-md">We couldn't load the products. Please check your connection and try again.</p>
                <button
                    onClick={() => setState("loading")}
                    className="mt-2 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                </button>
            </div>
            }
            {state === "success" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 w-full">
                    {products.map(product => (
                        <div key={product.key} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            {/* Product Image */}
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {product.image && product.image.length > 0 ? (
                                    <img 
                                        src={product.image[0]} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Category Badge */}
                                <span className="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full capitalize">
                                    {product.category}
                                </span>
                                {/* Availability Badge */}
                                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${product.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.availability ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            
                            {/* Product Details */}
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h2>
                                <p className="text-gray-500 text-sm mb-3 line-clamp-2 h-10">
                                    {product.description}
                                </p>
                                
                                {/* Dimensions */}
                                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                    <span>{product.dimensions}</span>
                                </div>
                                
                                {/* Price and Action */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div>
                                        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                                    </div>
                                    <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}