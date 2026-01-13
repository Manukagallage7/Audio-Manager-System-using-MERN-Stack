import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState('customer')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const navigate = useNavigate()

    function handleSignin() {
        navigate('/loginPage')
    }

    function handleSubmit(e) {
        e.preventDefault()
        console.log({ firstName, lastName, email, password, type, address, phoneNumber, profilePicture })
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            type: type,
            address: address,
            phoneNumber: phoneNumber,
            profilePicture: profilePicture
        }).then(res => {
            console.log('Registration successful:', res.data)
            toast.success('Registration successful! Please log in.')
            navigate('/loginPage')
        }).catch(err => {
            console.error('Registration error:', err)
            setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.')
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
        })
        setTimeout(() => setLoading(false), 600)
    }

    return (
        <>
            <div className='w-full min-h-screen flex justify-center items-center py-6' style={{ backgroundColor: '#FFF9D2' }}>
                <div className='relative'>
                    <div className='absolute -inset-4 rounded-2xl' style={{ background: 'linear-gradient(135deg,#FFB19A,#FF8473)', filter: 'blur(32px)', opacity: 0.25 }} />
                    <form onSubmit={handleSubmit}>
                        <div className='relative w-[520px] max-w-[92vw] rounded-2xl shadow-xl' style={{ backgroundColor: '#FF8473', color: '#FFF9D2' }}>
                            <div className='flex flex-col relative justify-center items-center gap-3 p-6'>
                                <img src="/logo.png" alt="Logo" className='object-cover w-12 h-12 drop-shadow' />
                                <h1 className='text-2xl font-extrabold' style={{ color: '#FFF9D2' }}>Create Account</h1>
                                <p className='text-xs' style={{ color: '#FFF9D2', opacity: 0.9 }}>Fill the details to create your account</p>

                                {/* Row 1: First & Last name */}
                                <div className='w-full grid grid-cols-2 gap-2'>
                                    <input
                                        type='text'
                                        placeholder='First name'
                                        className='w-full p-2.5 rounded-lg text-sm'
                                        style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={loading}
                                        aria-label='First name'
                                    />
                                    <input
                                        type='text'
                                        placeholder='Last name'
                                        className='w-full p-2.5 rounded-lg text-sm'
                                        style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={loading}
                                        aria-label='Last name'
                                    />
                                </div>

                                {/* Row 2: Email & Password */}
                                <div className='w-full grid grid-cols-2 gap-2'>
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        className='w-full p-2.5 rounded-lg text-sm'
                                        style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        aria-label='Email'
                                    />
                                    <div className='relative'>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Password'
                                            className='w-full p-2.5 rounded-lg text-sm pr-14'
                                            style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            aria-label='Password'
                                        />
                                        <button type='button' onClick={() => setShowPassword(s => !s)} aria-label='Toggle password visibility' className='absolute right-2 top-1/2 -translate-y-1/2 text-xs' style={{ color: '#FFF9D2', background: 'transparent' }}>
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                {/* Row 3: Address full width */}
                                <input
                                    type='text'
                                    placeholder='Address'
                                    className='w-full p-2.5 rounded-lg text-sm'
                                    style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={loading}
                                    aria-label='Address'
                                />

                                {/* Row 4: Phone & Profile picture */}
                                <div className='w-full grid grid-cols-2 gap-2'>
                                    <input
                                        type='text'
                                        placeholder='Phone number'
                                        className='w-full p-2.5 rounded-lg text-sm'
                                        style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        disabled={loading}
                                        aria-label='Phone number'
                                    />
                                    <input
                                        type='text'
                                        placeholder='Profile picture URL'
                                        className='w-full p-2.5 rounded-lg text-sm'
                                        style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                        value={profilePicture}
                                        onChange={(e) => setProfilePicture(e.target.value)}
                                        disabled={loading}
                                        aria-label='Profile picture URL'
                                    />
                                </div>

                                {/* Row 5: Account type */}
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className='w-full p-2.5 rounded-lg text-sm'
                                    style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                    disabled={loading}
                                    aria-label='Account type'
                                >
                                    <option value='customer'>Customer</option>
                                    <option value='admin'>Admin</option>
                                </select>

                                {errorMsg && <div className='text-xs px-2 py-1 rounded' style={{ background: 'rgba(0,0,0,0.12)', color: '#FFD2D2' }}>{errorMsg}</div>}

                                <button className='w-full p-2.5 mt-1 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-md text-sm' style={{ background: 'linear-gradient(90deg,#FF8473,#FF5F4A)', boxShadow: '0 8px 24px rgba(255,92,74,0.18)' }} disabled={loading}>
                                    {loading ? (
                                        <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <circle cx='12' cy='12' r='10' stroke='white' strokeOpacity='0.2' strokeWidth='4' />
                                            <path d='M22 12a10 10 0 00-10-10' stroke='white' strokeWidth='4' strokeLinecap='round' />
                                        </svg>
                                    ) : 'Sign Up'}
                                </button>

                                <button type='button' onClick={handleSignin} className='w-full p-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm' style={{ background: 'rgba(255,255,255,0.95)', color: '#FF5F4A', border: '1px solid rgba(255,255,255,0.12)' }}>Already have an account</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default RegisterPage