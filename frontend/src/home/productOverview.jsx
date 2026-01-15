import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImageSlider from "../components/imageSlider";

export default function ProductOverview() {
    const { key } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aspectRatio, setAspectRatio] = useState("16:9"); // "16:9", "9:16", or "1:1"

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

    // Detect image aspect ratio from first image
    useEffect(() => {
        if (product?.image?.[0]) {
            const img = new Image();
            img.onload = () => {
                const ratio = img.width / img.height;
                if (ratio > 1.2) {
                    setAspectRatio("16:9");
                } else if (ratio < 0.8) {
                    setAspectRatio("9:16");
                } else {
                    setAspectRatio("1:1");
                }
            };
            img.src = product.image[0];
        }
    }, [product]);

    const getAspectClass = () => {
        switch (aspectRatio) {
            case "16:9": return "aspect-video w-full"; // 16:9
            case "9:16": return "aspect-[9/16] h-[450px]"; // 9:16 - fixed height, width auto-calculated
            case "1:1": return "aspect-square w-full max-w-[400px]"; // 1:1
            default: return "aspect-video w-full";
        }
    };

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
                        {/* Image Gallery with Slider */}
                        <div className="space-y-4">
                            {/* Gallery Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">Product Gallery</h3>
                                        <p className="text-xs text-gray-500">{product.image?.length || 0} images • Click to zoom</p>
                                    </div>
                                </div>
                                
                                {/* Aspect Ratio Toggle */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 hidden sm:block">Ratio</span>
                                    <div className="flex gap-0.5 bg-gray-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setAspectRatio("16:9")}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${aspectRatio === "16:9" ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            16:9
                                        </button>
                                        <button
                                            onClick={() => setAspectRatio("1:1")}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${aspectRatio === "1:1" ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            1:1
                                        </button>
                                        <button
                                            onClick={() => setAspectRatio("9:16")}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${aspectRatio === "9:16" ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            9:16
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Availability Badge - Outside slider */}
                            <div className="flex justify-end mb-2">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${product.availability !== false ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    <span className={`w-2 h-2 rounded-full ${product.availability !== false ? 'bg-white animate-pulse' : 'bg-white'}`}></span>
                                    <span className="text-sm font-semibold">
                                        {product.availability !== false ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Main Image Slider Container */}
                            <div className="relative group flex items-center justify-center min-h-[300px]">
                                {/* Decorative elements */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                
                                <div className={`relative ${getAspectClass()} mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-xl`}>
                                    <ImageSlider 
                                        images={product.image} 
                                        showThumbnails={false}
                                        autoPlay={true}
                                        interval={5000}
                                    />
                                </div>
                            </div>
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