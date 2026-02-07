import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiCamera, FiEye, FiEyeOff, FiHeadphones, FiUserPlus, FiArrowRight, FiCheck, FiUpload, FiX } from 'react-icons/fi';
import uploadMedia from '../utils/mediaUpload';

export function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [step, setStep] = useState(1);

    const navigate = useNavigate();

    // Password strength checker
    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    function handleSubmit(e) {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (!agreeTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);
        
        const userData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
            type: 'customer',
            address: address.trim(),
            phoneNumber: phoneNumber.trim()
        };
        
        // Only add profilePicture if it exists
        if (profilePicture) {
            userData.profilePicture = profilePicture;
        }
        
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData)
        .then(res => {
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        }).catch(err => {
            console.error('Registration error:', err);
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        }).finally(() => {
            setLoading(false);
        });
    }

    const canProceedStep1 = firstName && lastName && email;
    const canProceedStep2 = password && confirmPassword && password === confirmPassword && passwordStrength >= 2;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-white/5"
                            style={{
                                top: `${20 + (i * 15)}%`,
                                left: `${10 + (i * 12)}%`,
                                transform: `rotate(${i * 15}deg)`,
                                animation: `float ${3 + i}s ease-in-out infinite`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl rotate-6"></div>
                            <div className="absolute inset-0 bg-slate-900 rounded-3xl flex items-center justify-center">
                                <FiHeadphones className="text-white text-4xl" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4 text-center">
                        Join Audio Manager
                    </h1>
                    <p className="text-gray-400 text-center text-lg mb-12 max-w-md">
                        Create your account and discover premium audio equipment curated just for you.
                    </p>

                    {/* Features */}
                    <div className="space-y-4 w-full max-w-sm">
                        {[
                            'Access to exclusive audio products',
                            'Personalized recommendations',
                            'Track your orders easily',
                            'Special member discounts'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <FiCheck className="text-white text-sm" />
                                </div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 120" className="w-full h-20 fill-slate-800/50">
                        <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"></path>
                    </svg>
                </div>
            </div>

            {/* Right Side - Register Form */}
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
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Fill in your details to get started</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                                    step >= s 
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                                        : 'bg-slate-700 text-gray-400'
                                }`}>
                                    {step > s ? <FiCheck /> : s}
                                </div>
                                {s < 3 && (
                                    <div className={`w-12 h-1 mx-1 rounded transition-all duration-300 ${
                                        step > s ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-slate-700'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                                
                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative group">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="First name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!canProceedStep1}
                                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <FiArrowRight />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Security */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                                <h3 className="text-lg font-semibold text-white mb-4">Create Password</h3>
                                
                                {/* Password */}
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {password && (
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full transition-all ${
                                                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-slate-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${passwordStrength >= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                                            Password strength: {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                                        </p>
                                    </div>
                                )}

                                {/* Confirm Password */}
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                            confirmPassword && password !== confirmPassword 
                                                ? 'border-red-500' 
                                                : confirmPassword && password === confirmPassword 
                                                    ? 'border-green-500' 
                                                    : 'border-slate-700'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-red-400 text-xs">Passwords do not match</p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        disabled={!canProceedStep2}
                                        className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Additional Info */}
                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                                <h3 className="text-lg font-semibold text-white mb-4">Additional Details <span className="text-gray-400 text-sm font-normal">(Optional)</span></h3>
                                
                                {/* Phone */}
                                <div className="relative group">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Address */}
                                <div className="relative group">
                                    <FiMapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                    <textarea
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        rows={2}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {/* Profile Picture Upload */}
                                <div className="space-y-3">
                                    <label className="text-sm text-gray-400">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        {/* Preview */}
                                        <div className="relative">
                                            <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed transition-all ${
                                                profilePreview ? 'border-indigo-500' : 'border-slate-600'
                                            }`}>
                                                {profilePreview ? (
                                                    <img 
                                                        src={profilePreview} 
                                                        alt="Profile preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-800/50 flex items-center justify-center">
                                                        <FiUser className="text-2xl text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            {profilePreview && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfilePicture('');
                                                        setProfilePreview('');
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                                                >
                                                    <FiX className="text-xs" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        {/* Upload Button */}
                                        <div className="flex-1">
                                            <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                                                uploadingImage 
                                                    ? 'bg-slate-700 cursor-not-allowed' 
                                                    : 'bg-slate-800/50 border border-slate-700 hover:border-indigo-500 hover:bg-slate-700/50'
                                            }`}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    disabled={uploadingImage}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            // Show preview immediately
                                                            const reader = new FileReader();
                                                            reader.onload = (e) => setProfilePreview(e.target.result);
                                                            reader.readAsDataURL(file);
                                                            
                                                            // Upload to Supabase
                                                            setUploadingImage(true);
                                                            try {
                                                                const url = await uploadMedia(file);
                                                                setProfilePicture(url);
                                                                toast.success('Image uploaded successfully!');
                                                            } catch (err) {
                                                                toast.error('Failed to upload image');
                                                                setProfilePreview('');
                                                            } finally {
                                                                setUploadingImage(false);
                                                            }
                                                        }
                                                    }}
                                                />
                                                {uploadingImage ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24" fill="none">
                                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                                                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                                        </svg>
                                                        <span className="text-gray-400 text-sm">Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiUpload className="text-indigo-400" />
                                                        <span className="text-gray-300 text-sm">Upload Image</span>
                                                    </>
                                                )}
                                            </label>
                                            <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={(e) => setAgreeTerms(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                                            agreeTerms 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent' 
                                                : 'border-slate-600 group-hover:border-indigo-500'
                                        }`}>
                                            {agreeTerms && <FiCheck className="text-white text-xs" />}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        I agree to the{' '}
                                        <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</a>
                                    </span>
                                </label>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !agreeTerms}
                                        className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                                                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <FiUserPlus />
                                                Create Account
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="text-gray-500 text-sm">or</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-xs mt-8">
                        © 2026 Audio Manager. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
                    50% { transform: translateY(-20px) rotate(var(--rotation, 0deg)); }
                }
            `}</style>
        </div>
    );
}

export default RegisterPage;