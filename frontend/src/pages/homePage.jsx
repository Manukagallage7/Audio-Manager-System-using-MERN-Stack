import { Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeadphones, FiArrowRight, FiPlay, FiMusic, FiVolume2, FiRadio, FiStar, FiUsers, FiAward, FiShield } from 'react-icons/fi';
import Header from '../components/header.jsx';
import Items from '../home/items.jsx';
import Gallery from '../home/gallery.jsx';
import Contact from '../home/contact.jsx';
import About from '../home/about.jsx';
import Home from '../home/home.jsx';
import BookingPage from '../home/bookingPage.jsx';
import ProductOverview from '../home/productOverview.jsx';
import Error from '../home/error.jsx';


// LandingPage component moved here for integration
function LandingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 30,
                y: (e.clientY / window.innerHeight - 0.5) * 30,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    const features = [
        { icon: FiHeadphones, title: 'Premium Audio', desc: 'Studio-quality equipment' },
        { icon: FiShield, title: 'Secure Rental', desc: '100% protected bookings' },
        { icon: FiUsers, title: '50K+ Customers', desc: 'Trusted by thousands' },
        { icon: FiAward, title: 'Top Rated', desc: '4.9 star rating' },
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div 
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                />
                <div 
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
                    style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
                />
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl animate-pulse"
                />
            </div>
            {/* Floating Music Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[FiHeadphones, FiMusic, FiVolume2, FiRadio, FiHeadphones, FiMusic, FiVolume2, FiRadio].map((Icon, i) => (
                    <div
                        key={i}
                        className="absolute w-16 h-16 bg-slate-800/30 rounded-2xl backdrop-blur-sm border border-white/5 flex items-center justify-center"
                        style={{
                            top: `${10 + (i * 11)}%`,
                            left: i % 2 === 0 ? `${5 + (i * 5)}%` : 'auto',
                            right: i % 2 !== 0 ? `${5 + (i * 4)}%` : 'auto',
                            animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
                            animationDelay: `${i * 0.3}s`
                        }}
                    >
                        <Icon className="text-indigo-400/40 text-2xl" />
                    </div>
                ))}
            </div>
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl rotate-6"></div>
                        <div className="absolute inset-0 bg-slate-900 rounded-xl flex items-center justify-center">
                            <FiHeadphones className="text-white text-xl" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">Audio</h1>
                        <p className="text-indigo-400 text-xs font-medium -mt-1">Manager</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link 
                        to="/login" 
                        className="px-5 py-2.5 text-gray-300 hover:text-white font-medium transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-5 py-2.5 bg-slate-800/50 border border-slate-700 text-white font-medium rounded-xl hover:bg-slate-700/50 transition-all"
                    >
                        Register
                    </Link>
                </div>
            </nav>
            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
                {/* Badge */}
                <div className="mb-8 animate-fadeInUp">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium">
                        <FiStar className="fill-current" />
                        #1 Audio Equipment Rental Platform
                    </span>
                </div>
                {/* Main Heading */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fadeInUp animation-delay-100">
                    Premium Audio
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        For Every Event
                    </span>
                </h1>
                {/* Subtitle */}
                <p className="text-xl text-gray-400 max-w-2xl mb-10 animate-fadeInUp animation-delay-200">
                    Experience studio-quality sound equipment rental. From professional microphones 
                    to high-end speakers, we've got everything for your perfect event.
                </p>
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fadeInUp animation-delay-300">
                    <Link
                        to="/register"
                        className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Get Started
                            <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {/* Shine effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </Link>
                    <Link
                        to="/login"
                        className="group px-10 py-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-white font-bold text-lg rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
                    >
                        <span className="flex items-center gap-3">
                            <FiPlay className="text-indigo-400" />
                            Browse Equipment
                        </span>
                    </Link>
                </div>
                {/* Features Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl animate-fadeInUp animation-delay-400">
                    {features.map((feature, i) => (
                        <div 
                            key={i}
                            className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all"
                        >
                            <feature.icon className="text-3xl text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                            <p className="text-gray-500 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-8 h-12 border-2 border-slate-600 rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-indigo-400 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
            {/* Sound Wave Animation at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 pb-4 opacity-20">
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full"
                        style={{
                            height: `${Math.random() * 60 + 20}px`,
                            animation: 'soundwave 1s ease-in-out infinite',
                            animationDelay: `${i * 0.05}s`
                        }}
                    />
                ))}
            </div>
            {/* Custom CSS */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
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
                @keyframes soundwave {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .animation-delay-100 { animation-delay: 0.1s; opacity: 0; }
                .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
                .animation-delay-300 { animation-delay: 0.3s; opacity: 0; }
                .animation-delay-400 { animation-delay: 0.4s; opacity: 0; }
            `}</style>
        </div>
    );
}


// Example: Replace with real authentication logic
export default function HomePage() {
    // Replace this with your actual authentication logic
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        // Example: check localStorage or context for auth
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    if (!isLoggedIn) {
        return <LandingPage />;
    }
    return (
        <>
            <Header />
            <div className='w-full'>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/items/:key" element={<ProductOverview />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path='/booking' element={<BookingPage/>}/>
                    <Route path="*" element={<Error />} />
                </Routes>
            </div>
        </>
    );
}