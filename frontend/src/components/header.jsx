import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiHeadphones } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    
    const location = useLocation();
    const navigate = useNavigate();

    // Check for logged in user and cart items
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
            } catch (e) {
                setUser(null);
            }
        }

        // Get cart count from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);

        // Listen for cart updates
        const handleStorageChange = () => {
            const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(updatedCart.length);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [location]);

    // Handle scroll effect - hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Set scrolled state for styling
            setIsScrolled(currentScrollY > 20);
            
            // Hide/show based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past threshold - hide header
                setIsHidden(true);
            } else {
                // Scrolling up - show header
                setIsHidden(false);
            }
            
            setLastScrollY(currentScrollY);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setUserMenuOpen(false);
        window.location.href = '/'; // Full reload to root
    };

    const isActive = (path) => {
        if (path === '/home') {
            return location.pathname === '/home';
        }
        return location.pathname.startsWith(path);
    };

    const navLinks = [
        { path: '/home', label: 'Home' },
        { path: '/items', label: 'Items' },
        { path: '/gallery', label: 'Gallery' },
        { path: '/contact', label: 'Contact' },
        { path: '/about', label: 'About' },
    ];

    return (
        <>
            <header className={`w-full fixed left-0 z-50 transition-all duration-300 ${
                isHidden ? '-top-[100px]' : 'top-0'
            } ${
                isScrolled 
                    ? 'h-[70px] bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-black/10' 
                    : 'h-[90px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
            }`}>
                <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className={`relative transition-all duration-300 ${isScrolled ? 'w-[50px] h-[50px]' : 'w-[60px] h-[60px]'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform"></div>
                            <div className="absolute inset-0 bg-slate-900 rounded-xl flex items-center justify-center">
                                <FiHeadphones className="text-white text-2xl" />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-bold text-lg leading-tight">Audio</h1>
                            <p className="text-indigo-400 text-xs font-medium">Manager</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 group ${
                                    isActive(link.path)
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {link.label}
                                {/* Active indicator */}
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ${
                                    isActive(link.path) ? 'w-6' : 'w-0 group-hover:w-4'
                                }`}></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Cart */}
                        <Link 
                            to="/booking" 
                            className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                            <FaCartShopping className="text-xl" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                        {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <FiChevronDown className={`hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-slate-700">
                                            <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                                            <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            {user.type === 'admin' && (
                                                <Link 
                                                    to="/adminPage" 
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <FiUser className="text-lg" />
                                                    <span>Admin Panel</span>
                                                </Link>
                                            )}
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <FiLogOut className="text-lg" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30"
                            >
                                <FiUser />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden absolute left-0 right-0 top-full bg-slate-900/98 backdrop-blur-lg border-b border-slate-700 transition-all duration-300 overflow-hidden ${
                    mobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0'
                }`}>
                    <nav className="flex flex-col px-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                    isActive(link.path)
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <Link 
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl"
                            >
                                <FiUser />
                                <span>Login</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Spacer for fixed header */}
            <div className={`transition-all duration-300 ${isScrolled ? 'h-[70px]' : 'h-[90px]'}`}></div>

            {/* Overlay for dropdowns */}
            {(userMenuOpen || mobileMenuOpen) && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => {
                        setUserMenuOpen(false);
                        setMobileMenuOpen(false);
                    }}
                ></div>
            )}
        </>
    );
} 