import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FiMail, FiLock, FiEye, FiEyeOff, FiHeadphones, FiLogIn, FiCheck, FiMusic, FiVolume2, FiRadio } from 'react-icons/fi';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const googleLogin = useGoogleLogin({
        onSuccess: (res) => {
            console.log(res);
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google-login`, {
                accessToken: res.access_token
            }).then(res => {
                toast.success('Login successful!');
                const user = res.data.user;
                localStorage.setItem("token", res.data.token);
                setTimeout(() => {
                    if(user.type === 'admin') {
                        window.location.href = '/adminPage';
                    } else if(user.type === 'customer') {
                        window.location.href = '/home';
                    }
                }, 500);
            })
            .catch(error => {
                const msg = error.response?.data?.message || 'Google login failed!';
                toast.error(msg);
            });
        }
    });
    
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const backendURL = import.meta.env.VITE_BACKEND_URL;
        setLoading(true);

        axios.post(`${backendURL}/api/users/login`, {
            email: email,
            password: password
        })
        .then(response => {
            toast.success('Login successful!');
            const user = response.data.user;
            localStorage.setItem("token", response.data.token);
            
            // Small delay to ensure token is saved, then redirect with page reload
            setTimeout(() => {
                if(user.type === 'admin') {
                    window.location.href = '/adminPage';
                } else if(user.type === 'customer') {
                    window.location.href = '/home';
                }
            }, 500);
        })
        .catch(error => {
            const msg = error.response?.data?.message || 'Login failed!';
            toast.error(msg);
        })
        .finally(() => setLoading(false));
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-6"></div>
                            <div className="absolute inset-0 bg-slate-800 rounded-2xl flex items-center justify-center">
                                <FiHeadphones className="text-white text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Sign in to continue to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Password</label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="sr-only"
                                        disabled={loading}
                                    />
                                    <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                                        rememberMe 
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent' 
                                            : 'border-slate-600 group-hover:border-indigo-500'
                                    }`}>
                                        {rememberMe && <FiCheck className="text-white text-xs" />}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400">Remember me</span>
                            </label>
                            <Link to="/forgotPassword" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <FiLogIn />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="text-gray-500 text-sm">or continue with</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </div>

                    {/* Google Login Button */}
                    <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-slate-800/50 border border-slate-700 rounded-xl text-gray-300 hover:bg-slate-700/50 hover:border-slate-600 transition-all"
                        onClick={googleLogin}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-medium">Continue with Google</span>
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center mt-8">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-xs mt-8">
                        © 2026 Audio Manager. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                {/* Floating Music Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {[FiHeadphones, FiMusic, FiVolume2, FiRadio, FiHeadphones, FiMusic].map((Icon, i) => (
                        <div
                            key={i}
                            className="absolute w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-white/5 flex items-center justify-center"
                            style={{
                                top: `${15 + (i * 14)}%`,
                                right: `${8 + (i * 10)}%`,
                                transform: `rotate(${i * 12}deg)`,
                                animation: `float ${4 + i}s ease-in-out infinite`,
                                animationDelay: `${i * 0.4}s`
                            }}
                        >
                            <Icon className="text-indigo-400/50 text-xl" />
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="relative w-28 h-28">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl rotate-6 animate-pulse"></div>
                            <div className="absolute inset-0 bg-slate-900 rounded-3xl flex items-center justify-center">
                                <FiHeadphones className="text-white text-5xl" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4 text-center">
                        Audio Manager
                    </h1>
                    <p className="text-gray-400 text-center text-lg mb-12 max-w-md">
                        Your premium destination for high-quality audio equipment and accessories.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 w-full max-w-md">
                        {[
                            { value: '10K+', label: 'Products' },
                            { value: '50K+', label: 'Customers' },
                            { value: '4.9', label: 'Rating' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial Card */}
                    <div className="mt-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 max-w-md">
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-300 text-sm italic mb-4">
                            "The best audio equipment store I've ever used. Quality products and amazing customer service!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                J
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">John Doe</div>
                                <div className="text-gray-500 text-xs">Verified Customer</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 120" className="w-full h-20 fill-slate-800/50">
                        <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"></path>
                    </svg>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
                    50% { transform: translateY(-15px) rotate(var(--rotation, 0deg)); }
                }
            `}</style>
        </div>
    );
}