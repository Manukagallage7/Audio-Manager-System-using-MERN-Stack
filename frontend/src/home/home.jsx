import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    FiHeadphones, FiMusic, FiStar, FiArrowRight, FiPlay, FiPause, 
    FiChevronLeft, FiChevronRight, FiMic, FiVolume2, FiRadio,
    FiUsers, FiAward, FiPackage, FiClock, FiShield, FiTruck,
    FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiHeart,
    FiZap, FiTarget, FiTrendingUp, FiGlobe
} from 'react-icons/fi';

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentReview, setCurrentReview] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState(true);
    const heroRef = useRef(null);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[data-animate]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`, { headers });
                const productList = res.data.products || res.data || [];
                setProducts(productList.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/review`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const reviewList = res.data.reviews || res.data || [];
                    // Filter approved reviews for non-admin display
                    const approvedReviews = reviewList.filter(r => r.isApproved);
                    setReviews(approvedReviews.length > 0 ? approvedReviews.slice(0, 6) : []);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                setReviews([]);
            }
        };
        fetchReviews();
    }, []);

    // Auto-rotate reviews
    useEffect(() => {
        if (!isPlaying || reviews.length === 0) return;
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPlaying, reviews.length]);

    const stats = [
        { icon: FiUsers, value: "10K+", label: "Happy Customers", color: "from-indigo-500 to-purple-500" },
        { icon: FiPackage, value: "500+", label: "Products Available", color: "from-emerald-500 to-teal-500" },
        { icon: FiAward, value: "50+", label: "Awards Won", color: "from-amber-500 to-orange-500" },
        { icon: FiGlobe, value: "25+", label: "Cities Covered", color: "from-pink-500 to-rose-500" },
    ];

    const features = [
        { icon: FiShield, title: "Quality Guaranteed", desc: "Premium equipment from top brands" },
        { icon: FiTruck, title: "Fast Delivery", desc: "Same-day delivery available" },
        { icon: FiClock, title: "24/7 Support", desc: "Round the clock assistance" },
        { icon: FiHeart, title: "Best Prices", desc: "Competitive rental rates" },
    ];

    const categories = [
        { icon: FiHeadphones, name: "Headphones", count: "120+ Items", color: "from-violet-500 to-purple-600" },
        { icon: FiMic, name: "Microphones", count: "85+ Items", color: "from-pink-500 to-rose-600" },
        { icon: FiVolume2, name: "Speakers", count: "95+ Items", color: "from-cyan-500 to-blue-600" },
        { icon: FiRadio, name: "Mixers", count: "60+ Items", color: "from-amber-500 to-orange-600" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* ============ HERO SECTION ============ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 py-20">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient Orbs with Parallax */}
                    <div 
                        className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
                    />
                    <div 
                        className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
                        style={{ transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)` }}
                    />
                    <div 
                        className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)` }}
                    />
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
                    
                    {/* Floating Music Notes */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-indigo-500/20 animate-float"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i % 3) * 20}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${4 + i}s`,
                            }}
                        >
                            <FiMusic className="text-4xl" />
                        </div>
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full mb-8 animate-fadeInUp">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-indigo-400 text-sm font-medium">#1 Audio Equipment Rental Platform</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fadeInUp animation-delay-100">
                        Premium Audio
                        <span className="block mt-2">
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                                Equipment Rental
                            </span>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fadeInUp animation-delay-200">
                        Experience studio-quality sound for your events. From professional microphones to 
                        high-end speakers, we've got everything you need.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeInUp animation-delay-300">
                        <button
                            onClick={() => navigate('/items')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Browse Equipment
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button
                            onClick={() => navigate('/about')}
                            className="group px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-white font-semibold rounded-xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <FiPlay className="text-indigo-400" />
                                Learn More
                            </span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fadeInUp animation-delay-400">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/30 transition-all hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="text-white text-xl" />
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-indigo-500 rounded-full animate-scroll" />
                    </div>
                </div>
            </section>

            {/* ============ CATEGORIES SECTION ============ */}
            <section id="categories" data-animate className="relative py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className={`text-center mb-10 transition-all duration-1000 ${isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <span className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium mb-3">
                            Categories
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                            Explore Our <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Collection</span>
                        </h2>
                        <p className="text-gray-400 text-base max-w-2xl mx-auto">
                            Find the perfect audio equipment for any occasion
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => navigate('/items')}
                                className={`group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:border-indigo-500/50 hover:-translate-y-2 ${isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                
                                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <category.icon className="text-white text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-500">{category.count}</p>
                                <FiArrowRight className="absolute bottom-8 right-8 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ FEATURED PRODUCTS SECTION ============ */}
            <section id="products" data-animate className="relative py-12 px-4 bg-slate-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className={`flex flex-col lg:flex-row lg:items-end justify-between mb-10 transition-all duration-1000 ${isVisible.products ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div>
                            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-3">
                                Featured Products
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                                Popular <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Equipment</span>
                            </h2>
                            <p className="text-gray-400 text-base max-w-xl">
                                Top-rated audio equipment loved by our customers
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/items')}
                            className="mt-6 lg:mt-0 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            View All Products
                            <FiArrowRight />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.length > 0 ? products.map((product, index) => (
                            <div
                                key={product._id || index}
                                onClick={() => navigate(`/items/${product.key}`)}
                                className={`group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 ${isVisible.products ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Image */}
                                <div className="relative h-56 bg-slate-700/50 overflow-hidden">
                                    <img
                                        src={product.image?.[0] || '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    {/* Quick View Button */}
                                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-slate-900 font-medium rounded-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                        Quick View
                                    </button>

                                    {/* Badge */}
                                    {product.availability && (
                                        <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded-full">
                                            Available
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-indigo-400 text-sm font-medium mb-2">{product.category}</p>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                                ${product.price}
                                            </span>
                                            <span className="text-gray-500 text-sm">/day</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <FiStar className="fill-current" />
                                            <span className="text-white text-sm">4.8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            // Skeleton Loading
                            [...Array(6)].map((_, index) => (
                                <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-3xl overflow-hidden animate-pulse">
                                    <div className="h-56 bg-slate-700/50" />
                                    <div className="p-6">
                                        <div className="h-4 w-20 bg-slate-700 rounded mb-2" />
                                        <div className="h-6 w-3/4 bg-slate-700 rounded mb-2" />
                                        <div className="h-4 w-full bg-slate-700 rounded mb-4" />
                                        <div className="h-8 w-24 bg-slate-700 rounded" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ============ FEATURES SECTION ============ */}
            <section id="features" data-animate className="relative py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div className={`transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <span className="inline-block px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm font-medium mb-3">
                                Why Choose Us
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                The Best Audio 
                                <span className="block bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                    Rental Experience
                                </span>
                            </h2>
                            <p className="text-gray-400 text-base mb-8">
                                We provide top-notch audio equipment with exceptional service. 
                                Our commitment to quality ensures your event sounds perfect.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-start gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl hover:border-pink-500/30 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <feature.icon className="text-pink-400 text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                            <p className="text-gray-500 text-sm">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right - Visual */}
                        <div className={`relative transition-all duration-1000 delay-200 ${isVisible.features ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <div className="relative">
                                {/* Main Image/Visual */}
                                <div className="relative bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-3xl p-8 overflow-hidden">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                                    
                                    <div className="relative z-10 flex flex-col items-center py-8">
                                        {/* Animated Sound Waves */}
                                        <div className="relative w-40 h-40 mb-8">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 animate-pulse" />
                                            <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                                                <FiHeadphones className="text-6xl text-pink-400" />
                                            </div>
                                            {/* Sound Rings */}
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute inset-0 rounded-full border border-pink-500/30 animate-ping"
                                                    style={{ animationDelay: `${i * 0.5}s`, animationDuration: '2s' }}
                                                />
                                            ))}
                                        </div>

                                        {/* Audio Bars Animation */}
                                        <div className="flex items-end gap-1 h-16">
                                            {[40, 70, 50, 80, 60, 90, 45, 75, 55, 85].map((height, i) => (
                                                <div
                                                    key={i}
                                                    className="w-2 bg-gradient-to-t from-pink-500 to-purple-400 rounded-full animate-audioBar"
                                                    style={{
                                                        height: `${height}%`,
                                                        animationDelay: `${i * 0.1}s`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -top-6 -right-6 bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <FiCheck className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Premium Quality</p>
                                            <p className="text-gray-500 text-sm">Verified Equipment</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-6 -left-6 bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl animate-float animation-delay-500">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <FiStar className="text-amber-400 fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">4.9 Rating</p>
                                            <p className="text-gray-500 text-sm">1200+ Reviews</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ TESTIMONIALS SECTION ============ */}
            <section id="reviews" data-animate className="relative py-12 px-4 bg-slate-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className={`text-center mb-10 transition-all duration-1000 ${isVisible.reviews ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <span className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-3">
                            Testimonials
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                            What Our <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Customers Say</span>
                        </h2>
                        <p className="text-gray-400 text-base max-w-2xl mx-auto">
                            Don't just take our word for it - hear from our satisfied customers
                        </p>
                    </div>

                    {/* Reviews Carousel */}
                    <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible.reviews ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 lg:p-10">
                            {/* Quote Icon */}
                            <div className="absolute top-8 right-8 text-6xl text-indigo-500/10">"</div>

                            {reviews.length > 0 ? (
                                <div className="text-center">
                                    {/* Stars */}
                                    <div className="flex items-center justify-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`text-xl ${i < (reviews[currentReview]?.rating || 5) ? 'text-amber-400 fill-current' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed transition-all duration-500">
                                        "{reviews[currentReview]?.comment || 'Amazing service and quality equipment!'}"
                                    </p>

                                    {/* Reviewer */}
                                    <div className="flex items-center justify-center gap-4">
                                        {reviews[currentReview]?.profilePicture ? (
                                            <img 
                                                src={reviews[currentReview].profilePicture} 
                                                alt={reviews[currentReview].name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                                                {reviews[currentReview]?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div className="text-left">
                                            <p className="text-white font-semibold">{reviews[currentReview]?.name || 'Happy Customer'}</p>
                                            <p className="text-gray-500 text-sm">Verified Customer</p>
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex items-center justify-center gap-4 mt-8">
                                        <button
                                            onClick={() => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
                                            className="p-2.5 bg-slate-700/50 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-xl transition-all"
                                        >
                                            <FiChevronLeft className="text-lg" />
                                        </button>
                                        
                                        {/* Dots */}
                                        <div className="flex items-center gap-2">
                                            {reviews.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentReview(index)}
                                                    className={`w-2 h-2 rounded-full transition-all ${currentReview === index ? 'w-6 bg-indigo-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
                                            className="p-2.5 bg-slate-700/50 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-xl transition-all"
                                        >
                                            <FiChevronRight className="text-lg" />
                                        </button>

                                        {/* Play/Pause */}
                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="p-2.5 bg-slate-700/50 hover:bg-slate-700 text-gray-400 hover:text-white rounded-xl transition-all ml-2"
                                        >
                                            {isPlaying ? <FiPause /> : <FiPlay />}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FiStar className="text-4xl text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ ABOUT PREVIEW SECTION ============ */}
            <section id="about" data-animate className="relative py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Visual */}
                        <div className={`relative transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <div className="relative">
                                {/* Main Visual */}
                                <div className="relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl overflow-hidden aspect-square">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            {/* Central Logo/Icon */}
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25">
                                                <FiHeadphones className="text-white text-5xl" />
                                            </div>
                                            
                                            {/* Orbiting Icons */}
                                            {[FiMic, FiVolume2, FiRadio, FiMusic].map((Icon, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg animate-orbit"
                                                    style={{
                                                        animationDelay: `${i * -5}s`,
                                                        animationDuration: '20s',
                                                    }}
                                                >
                                                    <Icon className="text-indigo-400 text-xl" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.1),transparent_50%)]" />
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.1),transparent_50%)]" />
                                </div>

                                {/* Experience Badge */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-8 py-4 shadow-xl">
                                    <p className="text-white font-bold text-2xl">10+ Years</p>
                                    <p className="text-indigo-200 text-sm">of Excellence</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div className={`transition-all duration-1000 delay-200 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <span className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium mb-3">
                                About Us
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Your Trusted 
                                <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Audio Partner
                                </span>
                            </h2>
                            <p className="text-gray-400 text-base mb-4 leading-relaxed">
                                Since 2014, we've been providing premium audio equipment to events 
                                of all sizes. Our passion for sound quality drives us to maintain 
                                the best equipment and deliver exceptional service.
                            </p>
                            <p className="text-gray-400 text-base mb-6 leading-relaxed">
                                From intimate gatherings to large concerts, we have the expertise 
                                and equipment to make your event sound amazing.
                            </p>

                            {/* Key Points */}
                            <div className="grid sm:grid-cols-2 gap-3 mb-6">
                                {[
                                    { icon: FiZap, text: "Professional Grade Equipment" },
                                    { icon: FiTarget, text: "Expert Technical Support" },
                                    { icon: FiTrendingUp, text: "Competitive Pricing" },
                                    { icon: FiShield, text: "Fully Insured Rentals" },
                                ].map((point, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                            <point.icon className="text-indigo-400" />
                                        </div>
                                        <span className="text-gray-300">{point.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate('/about')}
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                            >
                                Learn More About Us
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CONTACT SECTION ============ */}
            <section id="contact" data-animate className="relative py-12 px-4 bg-slate-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className={`text-center mb-10 transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-3">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                            Have Any <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Questions?</span>
                        </h2>
                        <p className="text-gray-400 text-base max-w-2xl mx-auto">
                            We're here to help! Reach out to us for any inquiries about our equipment or services.
                        </p>
                    </div>

                    <div className={`grid lg:grid-cols-3 gap-6 transition-all duration-1000 delay-200 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {/* Contact Cards */}
                        {[
                            { icon: FiPhone, title: "Call Us", value: "+1 (555) 123-4567", desc: "Mon-Fri 9am-6pm", color: "from-emerald-500 to-teal-500" },
                            { icon: FiMail, title: "Email Us", value: "info@audiomanager.com", desc: "We reply within 24hrs", color: "from-indigo-500 to-purple-500" },
                            { icon: FiMapPin, title: "Visit Us", value: "123 Sound Street", desc: "New York, NY 10001", color: "from-pink-500 to-rose-500" },
                        ].map((contact, index) => (
                            <div
                                key={index}
                                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 text-center hover:border-indigo-500/30 transition-all hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                    <contact.icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                                <p className="text-indigo-400 font-medium mb-1">{contact.value}</p>
                                <p className="text-gray-500 text-sm">{contact.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => navigate('/contact')}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                        >
                            <FiSend />
                            Send Us a Message
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ============ FINAL CTA SECTION ============ */}
            <section className="relative py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 lg:p-12 text-center overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-white/10 animate-float" />
                        <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full bg-white/10 animate-float animation-delay-500" />

                        <div className="relative z-10">
                            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
                                Ready to Make Your Event Sound Amazing?
                            </h2>
                            <p className="text-indigo-100 text-base mb-8 max-w-2xl mx-auto">
                                Browse our collection of premium audio equipment and book your rental today. 
                                Professional quality at affordable prices.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/items')}
                                    className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                                >
                                    Start Browsing
                                </button>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom CSS for Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                @keyframes scroll {
                    0%, 100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(6px);
                        opacity: 0.5;
                    }
                }
                
                @keyframes gradient {
                    0%, 100% {
                        background-size: 200% 200%;
                        background-position: left center;
                    }
                    50% {
                        background-size: 200% 200%;
                        background-position: right center;
                    }
                }
                
                @keyframes audioBar {
                    0%, 100% {
                        transform: scaleY(1);
                    }
                    50% {
                        transform: scaleY(0.5);
                    }
                }
                
                @keyframes orbit {
                    from {
                        transform: rotate(0deg) translateX(100px) rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg) translateX(100px) rotate(-360deg);
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
                
                .animate-gradient {
                    animation: gradient 6s ease infinite;
                }
                
                .animate-audioBar {
                    animation: audioBar 0.8s ease-in-out infinite;
                }
                
                .animate-orbit {
                    animation: orbit 20s linear infinite;
                }
                
                .animation-delay-100 {
                    animation-delay: 0.1s;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-300 {
                    animation-delay: 0.3s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
            `}</style>
        </div>
    );
}