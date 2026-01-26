import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { addToCart } from "../utils/cart";
import { FiSearch, FiFilter, FiGrid, FiList, FiShoppingCart, FiEye, FiHeadphones, FiX, FiChevronDown, FiStar, FiPackage } from 'react-icons/fi';

export default function Items() {
    const [state, setState] = useState("loading");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [viewMode, setViewMode] = useState("grid");
    const navigate = useNavigate();

    const categories = ["all", "speakers", "microphones", "amplifiers", "mixers", "headphones", "accessories"];
    const priceRanges = [
        { value: "all", label: "All Prices" },
        { value: "0-50", label: "Under $50" },
        { value: "50-100", label: "$50 - $100" },
        { value: "100-200", label: "$100 - $200" },
        { value: "200+", label: "$200+" }
    ];

    useEffect(() => {
        if (state === "loading") {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`)
                .then(res => {
                    setProducts(res.data.products || []);
                    setFilteredProducts(res.data.products || []);
                    setState("success");
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || "There was an error fetching the products!");
                    setState("error");
                });
        }
    }, [state]);

    // Filter and sort products
    useEffect(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            result = result.filter(p => 
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== "all") {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory);
        }

        // Price filter
        if (priceRange !== "all") {
            const [min, max] = priceRange.split("-").map(Number);
            if (max) {
                result = result.filter(p => p.price >= min && p.price <= max);
            } else {
                result = result.filter(p => p.price >= 200);
            }
        }

        // Sorting
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name":
                result.sort((a, b) => a.name?.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

    const handleAddToCart = (product) => {
        addToCart(product.key, 1);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                            <FiHeadphones className="text-indigo-400" />
                            <span className="text-indigo-400 text-sm font-medium">Premium Audio Equipment</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Browse Our <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Collection</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Discover professional audio equipment for your events. From speakers to mixers, we have everything you need.
                        </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Search equipment..."
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

                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[160px]"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-slate-800">
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Price Range */}
                            <div className="relative">
                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="appearance-none bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[140px]"
                                >
                                    {priceRanges.map(range => (
                                        <option key={range.value} value={range.value} className="bg-slate-800">
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Sort By */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[150px]"
                                >
                                    <option value="default" className="bg-slate-800">Default</option>
                                    <option value="price-low" className="bg-slate-800">Price: Low to High</option>
                                    <option value="price-high" className="bg-slate-800">Price: High to Low</option>
                                    <option value="name" className="bg-slate-800">Name: A-Z</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
                                >
                                    <FiGrid className="text-xl" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
                                >
                                    <FiList className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <p className="text-gray-400">
                                Showing <span className="text-white font-medium">{filteredProducts.length}</span> of <span className="text-white font-medium">{products.length}</span> products
                            </p>
                            {(searchQuery || selectedCategory !== "all" || priceRange !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                        setPriceRange("all");
                                        setSortBy("default");
                                    }}
                                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                    <FiX className="text-sm" />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Loading State */}
                    {state === "loading" && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-500/30 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-400 mt-4 animate-pulse">Loading equipment...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {state === "error" && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
                                <FiX className="text-red-400 text-4xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
                            <p className="text-gray-400 mb-6">We couldn't load the products. Please try again.</p>
                            <button
                                onClick={() => setState("loading")}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* No Results */}
                    {state === "success" && filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-20 h-20 bg-slate-700/50 border border-slate-600 rounded-full flex items-center justify-center mb-6">
                                <FiPackage className="text-gray-400 text-4xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                    setPriceRange("all");
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {state === "success" && filteredProducts.length > 0 && (
                        <div className={viewMode === "grid" 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "flex flex-col gap-4"
                        }>
                            {filteredProducts.map(product => (
                                viewMode === "grid" ? (
                                    // Grid Card
                                    <div 
                                        key={product.key} 
                                        className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Product Image */}
                                        <div className="relative h-52 bg-gradient-to-br from-slate-700/50 to-slate-800/50 overflow-hidden">
                                            {product.image && product.image.length > 0 ? (
                                                <img 
                                                    src={product.image[0]} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiHeadphones className="text-6xl text-slate-600" />
                                                </div>
                                            )}
                                            
                                            {/* Overlay on Hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            {/* Category Badge */}
                                            <span className="absolute top-3 left-3 px-3 py-1 bg-indigo-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
                                                {product.category}
                                            </span>
                                            
                                            {/* Availability Badge */}
                                            <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                                                product.availability !== false 
                                                    ? 'bg-emerald-500/90 text-white' 
                                                    : 'bg-red-500/90 text-white'
                                            }`}>
                                                {product.availability !== false ? 'Available' : 'Unavailable'}
                                            </span>

                                            {/* Quick Actions on Hover */}
                                            <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                <button
                                                    onClick={() => navigate(`/items/${product.key}`)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <FiEye />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                                >
                                                    <FiShoppingCart />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="p-5">
                                            <h2 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-indigo-400 transition-colors">
                                                {product.name}
                                            </h2>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                                                {product.description}
                                            </p>
                                            
                                            {/* Price */}
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                                <div>
                                                    <span className="text-xs text-gray-500">Per day</span>
                                                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                                        ${product.price}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    <FiStar className="fill-current" />
                                                    <span className="text-sm font-medium">4.8</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // List Card
                                    <div 
                                        key={product.key}
                                        className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-48 h-40 flex-shrink-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 overflow-hidden">
                                            {product.image && product.image.length > 0 ? (
                                                <img 
                                                    src={product.image[0]} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiHeadphones className="text-4xl text-slate-600" />
                                                </div>
                                            )}
                                            <span className="absolute top-3 left-3 px-3 py-1 bg-indigo-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
                                                {product.category}
                                            </span>
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h2 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                        {product.name}
                                                    </h2>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                                                        product.availability !== false 
                                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                                            : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                        {product.availability !== false ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <span className="text-xs text-gray-500">Per day</span>
                                                        <p className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                                            ${product.price}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-amber-400">
                                                        <FiStar className="fill-current" />
                                                        <span className="text-sm font-medium">4.8</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/items/${product.key}`)}
                                                        className="px-4 py-2 bg-slate-700/50 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <FiEye />
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
                                                    >
                                                        <FiShoppingCart />
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}