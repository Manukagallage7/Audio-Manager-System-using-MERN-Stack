import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ProductDetail() {
    const { key } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${key}`);
                setProduct(res.data.product || res.data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load product details");
                setLoading(false);
            }
        }
        fetchProduct();
    }, [key]);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-gray-600 text-lg animate-pulse">Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Product Not Found</h3>
                <button
                    onClick={() => navigate("/homePage/items")}
                    className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
                >
                    Back to Items
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/homePage/items")}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Items
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                                {product.image && product.image.length > 0 ? (
                                    <img
                                        src={product.image[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Availability Badge */}
                                <span className={`absolute top-4 right-4 px-3 py-1.5 text-sm font-medium rounded-full ${product.availability !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.availability !== false ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.image && product.image.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.image.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            {/* Category Badge */}
                            <span className="inline-block w-fit px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full capitalize mb-4">
                                {product.category}
                            </span>

                            {/* Product Name */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Dimensions */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dimensions</h3>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                    <span>{product.dimensions}</span>
                                </div>
                            </div>

                            {/* Product Key */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Product ID</h3>
                                <span className="text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded">
                                    {product.key}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto flex gap-4">
                                <button
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${product.availability !== false ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                    disabled={product.availability === false}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {product.availability !== false ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button className="py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
