import { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate();
    function handleForgot() {
        navigate('/forgotPassword');
    }

    function handleSignup() {
        navigate('/registerPage');
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        const backendURL = import.meta.env.VITE_BACKEND_URL
        setLoading(true)
        setErrorMsg('')

        axios.post(`${backendURL}/api/users/login`, {
            email: email,
            password: password
        })
        .then(response => {
            console.log('Login successful:', response.data)
            toast.success('Login successful!')
            const user = response.data.user
            localStorage.setItem("token", response.data.token)
            if(user.type === 'admin') {
                navigate('/adminPage');
            } else if(user.type === 'customer') {
                navigate('/homePage');
            }
        })
        .catch(error => {
            console.error('There was an error logging in!', error);
            const msg = error.response?.data?.message || 'Login failed!'
            setErrorMsg(msg)
            toast.error(msg);
        })
        .finally(() => setLoading(false));
    }

    return (
        <>
        <div className='w-full h-screen flex justify-center items-center' style={{ backgroundColor: '#FFF9D2' }}>
            <div className='relative'>
                <div className='absolute -inset-6 rounded-3xl' style={{ background: 'linear-gradient(135deg,#FFB19A,#FF8473)', filter: 'blur(40px)', opacity: 0.28 }} />
                <form onSubmit={handleSubmit}>
                    <div className='relative z-10 w-[480px] max-w-[92vw] h-auto rounded-3xl shadow-xl' style={{ backgroundColor: '#FF8473', color: '#FFF9D2' }}>
                        <div className='flex flex-col relative justify-center items-center h-full gap-4 p-8'>
                            <img src="/logo.png" alt="Logo" className='object-cover w-16 h-16 mb-2 drop-shadow' />
                            <h1 className='text-3xl font-extrabold' style={{ color: '#FFF9D2' }}>Welcome Back</h1>
                            <p className='text-sm' style={{ color: '#FFF9D2', opacity: 0.9 }}>Sign in to continue to your account</p>

                            <input
                                type="email"
                                placeholder='Email'
                                className='w-full p-3 rounded-lg mt-2'
                                style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                aria-label="Email"
                            />

                            <div className='w-full relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Password'
                                    className='w-full p-3 rounded-lg mt-2'
                                    style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#FFF9D2' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    aria-label="Password"
                                />
                                <button type='button' onClick={() => setShowPassword(s => !s)} aria-label='Toggle password visibility' className='absolute right-3 top-3 text-sm' style={{ color: '#FFF9D2', background: 'transparent' }}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            <div className='w-full flex items-center justify-between mt-1'>
                                <label className='flex items-center gap-2 text-sm' style={{ color: '#FFF9D2' }}>
                                    <input type='checkbox' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={loading} />
                                    Remember me
                                </label>
                                <button type='button' onClick={handleForgot} className='text-sm underline' style={{ color: '#FFF9D2', opacity: 0.95, background: 'transparent' }}>Forgot password?</button>
                            </div>

                            {errorMsg && <div className='text-sm mt-2 px-2 py-1 rounded' style={{ background: 'rgba(0,0,0,0.12)', color: '#FFD2D2' }}>{errorMsg}</div>}

                            <button className='w-full p-3 mt-3 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-md' style={{ background: 'linear-gradient(90deg,#FF8473,#FF5F4A)', boxShadow: '0 8px 24px rgba(255,92,74,0.18)' }} disabled={loading}>
                                {loading ? (
                                    <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <circle cx='12' cy='12' r='10' stroke='white' strokeOpacity='0.2' strokeWidth='4' />
                                        <path d='M22 12a10 10 0 00-10-10' stroke='white' strokeWidth='4' strokeLinecap='round' />
                                    </svg>
                                ) : 'Sign In'}
                            </button>

                            <button type='button' onClick={handleSignup} className='w-full p-3 mt-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all' style={{ background: 'rgba(255,255,255,0.95)', color: '#FF5F4A', border: '1px solid rgba(255,255,255,0.12)' }}>Create account</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}