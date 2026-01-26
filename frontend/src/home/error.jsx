import { Link } from 'react-router-dom';
import { FiHome, FiHeadphones, FiArrowLeft, FiMusic, FiVolume2, FiRadio } from 'react-icons/fi';

export default function Error() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating Music Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[FiHeadphones, FiMusic, FiVolume2, FiRadio, FiHeadphones, FiMusic].map((Icon, i) => (
                    <div
                        key={i}
                        className="absolute w-12 h-12 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-white/5 flex items-center justify-center"
                        style={{
                            top: `${10 + (i * 15)}%`,
                            left: `${5 + (i * 15)}%`,
                            animation: `float ${4 + i}s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`
                        }}
                    >
                        <Icon className="text-indigo-400/30 text-lg" />
                    </div>
                ))}
                {[FiRadio, FiVolume2, FiMusic, FiHeadphones].map((Icon, i) => (
                    <div
                        key={`right-${i}`}
                        className="absolute w-10 h-10 bg-slate-800/30 rounded-lg backdrop-blur-sm border border-white/5 flex items-center justify-center"
                        style={{
                            top: `${20 + (i * 18)}%`,
                            right: `${8 + (i * 12)}%`,
                            animation: `float ${5 + i}s ease-in-out infinite`,
                            animationDelay: `${i * 0.7}s`
                        }}
                    >
                        <Icon className="text-purple-400/30 text-sm" />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Broken Headphones Icon - Redesigned, no cross mark */}
                <div className="mb-8 relative inline-block">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative w-full h-full bg-slate-800/90 rounded-full flex items-center justify-center border-4 border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                            <FiHeadphones className="text-7xl text-indigo-400 animate-bounce" style={{ animationDuration: '2s' }} />
                        </div>
                    </div>
                </div>

                {/* 404 Number - Modernized */}
                <div className="relative mb-6">
                    <h1 className="text-[120px] sm:text-[180px] font-extrabold leading-none bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent select-none drop-shadow-lg">
                        404
                    </h1>
                    <div className="absolute inset-0 text-[120px] sm:text-[180px] font-extrabold leading-none text-indigo-500/10 blur-2xl select-none">
                        404
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                    Oops! This page can’t be found
                </h2>
                <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
                    The page you’re looking for doesn’t exist or was moved. Let’s get you back to the music!
                </p>

                {/* Sound Wave Animation - Subtle */}
                <div className="flex items-center justify-center gap-1 mb-10">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 bg-gradient-to-t from-indigo-400 to-purple-400 rounded-full opacity-80"
                            style={{
                                height: `${18 + 12 * Math.abs(Math.sin(i))}px`,
                                animation: 'soundwave 1s ease-in-out infinite',
                                animationDelay: `${i * 0.12}s`
                            }}
                        />
                    ))}
                </div>

                {/* Action Buttons - Modernized */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
                    <Link
                        to="/"
                        className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                    >
                        <FiHome className="text-lg group-hover:scale-110 transition-transform" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-800/60 border border-slate-700 text-gray-300 hover:text-white hover:bg-slate-700/70 hover:border-slate-600 font-semibold rounded-xl transition-all"
                    >
                        <FiArrowLeft className="text-lg" />
                        Go Back
                    </button>
                </div>

                {/* Helpful Links - Minimalist */}
                <div className="mt-10 pt-8 border-t border-slate-800">
                    <p className="text-gray-500 text-sm mb-4">Quick links:</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {[
                            { label: 'Products', path: '/items' },
                            { label: 'Gallery', path: '/gallery' },
                            { label: 'Contact', path: '/contact' },
                            { label: 'About', path: '/about' }
                        ].map((link, i) => (
                            <Link
                                key={i}
                                to={link.path}
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors hover:underline"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes soundwave {
                    0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
                    50% { transform: scaleY(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}