import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImageSlider from "../components/imageSlider";
import { addToCart } from "../utils/cart";
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2, FiCheck, FiPackage, FiTruck, FiShield, FiStar, FiImage, FiMaximize, FiBox, FiTag, FiInfo, FiHeadphones } from 'react-icons/fi';

export default function ProductOverview() {
    const { key } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

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
            case "16:9": return "aspect-video w-full";
            case "9:16": return "aspect-[9/16] h-[450px]";
            case "1:1": return "aspect-square w-full max-w-[400px]";
            default: return "aspect-video w-full";
        }
    };

    const handleAddToCart = () => {
        addToCart(product.key, quantity);
        toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart`);
        navigate("/booking");
    };

    const features = [
        { icon: FiTruck, title: 'Free Delivery', desc: 'On orders over $100' },
        { icon: FiShield, title: 'Quality Guaranteed', desc: 'Professionally maintained' },
        { icon: FiPackage, title: 'Easy Returns', desc: '30-day return policy' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 animate-pulse">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
                        <FiPackage className="text-red-400 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Product Not Found</h3>
                    <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate("/items")}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                        Back to Items
                    </button>
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
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb / Back Button */}
                <button
                    onClick={() => navigate("/items")}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Items</span>
                </button>

                {/* Main Product Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Gallery Section */}
                        <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-700/50">
                            {/* Gallery Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <FiImage className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Product Gallery</h3>
                                        <p className="text-xs text-gray-500">{product.image?.length || 0} images</p>
                                    </div>
                                </div>
                                
                                {/* Aspect Ratio Toggle */}
                                <div className="flex items-center gap-2">
                                    <FiMaximize className="text-gray-500 text-sm" />
                                    <div className="flex gap-1 bg-slate-700/50 p-1 rounded-xl">
                                        {["16:9", "1:1", "9:16"].map((ratio) => (
                                            <button
                                                key={ratio}
                                                onClick={() => setAspectRatio(ratio)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                                    aspectRatio === ratio 
                                                        ? 'bg-indigo-600 text-white' 
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                {ratio}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Availability Badge */}
                            <div className="flex justify-end mb-4">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                    product.availability !== false 
                                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' 
                                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${
                                        product.availability !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                                    }`}></span>
                                    <span className="text-sm font-medium">
                                        {product.availability !== false ? 'Available' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Main Image Slider */}
                            <div className="relative group flex items-center justify-center">
                                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                
                                <div className={`relative ${getAspectClass()} mx-auto bg-slate-700/50 rounded-2xl overflow-hidden`}>
                                    <ImageSlider 
                                        images={product.image} 
                                        showThumbnails={false}
                                        autoPlay={true}
                                        interval={5000}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="p-6 lg:p-8 flex flex-col">
                            {/* Category & Rating */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium rounded-full capitalize">
                                    <FiTag className="text-xs" />
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={`${i < 4 ? 'fill-current' : ''}`} />
                                    ))}
                                    <span className="text-gray-400 text-sm ml-2">(4.8)</span>
                                </div>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    ${product.price}
                                </span>
                                <span className="text-gray-500 text-sm">/ per day</span>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-4 border-b border-slate-700/50 pb-4">
                                {[
                                    { id: 'description', label: 'Description', icon: FiInfo },
                                    { id: 'specs', label: 'Specifications', icon: FiBox }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <tab.icon />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="mb-6 flex-1">
                                {activeTab === 'description' && (
                                    <p className="text-gray-400 leading-relaxed">
                                        {product.description}
                                    </p>
                                )}
                                {activeTab === 'specs' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                                            <span className="text-gray-400">Dimensions</span>
                                            <span className="text-white font-medium">{product.dimensions}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                                            <span className="text-gray-400">Product ID</span>
                                            <span className="text-white font-mono bg-slate-700/50 px-3 py-1 rounded-lg text-sm">{product.key}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                                            <span className="text-gray-400">Category</span>
                                            <span className="text-white capitalize">{product.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3">
                                            <span className="text-gray-400">Availability</span>
                                            <span className={product.availability !== false ? 'text-emerald-400' : 'text-red-400'}>
                                                {product.availability !== false ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-gray-400 text-sm">Quantity:</span>
                                <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-600 rounded-lg transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-white font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-600 rounded-lg transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={product.availability !== false ? handleAddToCart : undefined}
                                    disabled={product.availability === false}
                                    className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                                        product.availability !== false 
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30' 
                                            : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <FiShoppingCart className="text-xl" />
                                    {product.availability !== false ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button 
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`p-4 rounded-xl border transition-all ${
                                        isWishlisted 
                                            ? 'bg-pink-500/20 border-pink-500/30 text-pink-400' 
                                            : 'border-slate-600 text-gray-400 hover:text-pink-400 hover:border-pink-500/30'
                                    }`}
                                >
                                    <FiHeart className={isWishlisted ? 'fill-current' : ''} />
                                </button>
                                <button className="p-4 rounded-xl border border-slate-600 text-gray-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                                    <FiShare2 />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 flex items-center gap-4 hover:border-indigo-500/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <feature.icon className="text-indigo-400 text-xl" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">{feature.title}</h4>
                                <p className="text-gray-500 text-sm">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}