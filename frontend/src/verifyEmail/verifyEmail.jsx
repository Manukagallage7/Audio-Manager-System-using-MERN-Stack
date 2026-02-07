import { useEffect, useRef } from "react"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowRight, FiCheck, FiHeadphones } from 'react-icons/fi';

export function VerifyEmail() {

    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || '{}')
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [isSendingOtp, setIsSendingOtp] = useState(false)
    const navigate = useNavigate()
    const otpSentRef = useRef(false)
    const sendingRef = useRef(false)
    
    useEffect(() => {
        // Guard: prevent if already sent or currently sending
        if (otpSentRef.current || sendingRef.current) return;
        if (!user.email || !token) return;
        
        sendingRef.current = true;
        
        const sendOTPOnce = async () => {
            try {
                setIsSendingOtp(true)
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`, {
                    email: user.email
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('OTP sent successfully:', response.data)
                otpSentRef.current = true
                setOtpSent(true)
                setResendCooldown(60)
                toast.success('OTP sent to your email')
            } catch (error) {
                console.error('Failed to send OTP:', error);
                // Handle rate limit response
                if (error.response?.status === 429) {
                    const retryAfter = error.response?.data?.retryAfter || 30;
                    setResendCooldown(retryAfter);
                    toast.error(error.response?.data?.message || 'Please wait before requesting another OTP');
                } else {
                    toast.error(error.response?.data?.message || 'Failed to send OTP');
                }
                sendingRef.current = false // Reset on error
            } finally {
                setIsSendingOtp(false)
            }
        }
        
        sendOTPOnce()
    }, [])

    // Cooldown timer for resend button
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown])

    function handleVerifyEmail() {
        if (!otp) {
            toast.error('Please enter OTP')
            return
        }
        
        setLoading(true)
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`, {
            email: user.email,
            code: otp
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res.data)
            toast.success("Email verified successfully!")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/login")
        }).catch((error) => {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to verify email. Please try again.")
        }).finally(() => {
            setLoading(false)
        });
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Card Background */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-6"></div>
                            <div className="absolute inset-0 bg-slate-800 rounded-2xl flex items-center justify-center">
                                <FiHeadphones className="text-white text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
                        <p className="text-gray-400">Enter the OTP sent to your email address</p>
                    </div>

                    {/* Email Display */}
                    <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                        <FiMail className="text-indigo-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm break-all">{user.email || 'Loading...'}</span>
                    </div>

                    {/* OTP Input */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-300 block mb-3">Enter 6-Digit OTP</label>
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength="6"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={handleVerifyEmail}
                        disabled={loading || !otp || otp.length !== 6}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 mb-4"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            <>
                                <FiCheck />
                                Verify Email
                                <FiArrowRight />
                            </>
                        )}
                    </button>

                    {/* Resend OTP Button */}
                    <button
                        onClick={() => {
                            if (resendCooldown > 0) return;
                            const sendOTP = async () => {
                                try {
                                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`, {
                                        email: user.email
                                    }, {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    });
                                    toast.success('New OTP sent to your email')
                                    setOtp('')
                                    setResendCooldown(60) // 60 second cooldown
                                } catch (error) {
                                    console.error('Resend OTP error:', error);
                                    if (error.response?.status === 429) {
                                        const retryAfter = error.response?.data?.retryAfter || 30;
                                        setResendCooldown(retryAfter);
                                        toast.error(error.response?.data?.message || 'Please wait before requesting another OTP');
                                    } else {
                                        toast.error(error.response?.data?.message || 'Failed to resend OTP')
                                    }
                                }
                            }
                            sendOTP()
                        }}
                        disabled={resendCooldown > 0}
                        className={`w-full py-3 border font-semibold rounded-xl transition-all ${
                            resendCooldown > 0
                                ? 'bg-slate-700/30 border-slate-600 text-gray-500 cursor-not-allowed'
                                : 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-gray-300 hover:text-white'
                        }`}
                    >
                        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                    </button>

                    {/* Info Text */}
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-sm text-blue-300">
                            <span className="font-semibold">Note:</span> OTP is valid for 5 minutes. If you haven't received the email, check your spam folder.
                        </p>
                    </div>

                    {/* Back to Login */}
                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Changed your mind?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
