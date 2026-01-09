import { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);

        axios.post('http://localhost:5000/api/users/login', {
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
            toast.error(error.response?.data?.message || 'Login failed!');
        });
    }

    return (
        <>
        <div className='bg-amber-50 w-full h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit}>
            <div className=' bg-amber-600 w-[400px] h-[400px] backdrop-blur-2xl rounded-2xl'>
                <div className='flex flex-col relative justify-center items-center h-full gap-6'>
                    <img src="/logo.png" alt="Logo" className=' object-cover w-16 h-16 mb-4'/>
                    <h1 className='text-3xl font-bold text-amber-900'>Login</h1>
                    <input
                        type="email"
                        placeholder='Email'
                        className='w-3/4 p-3 rounded-lg border border-amber-300 focus:outline-amber-500'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        className='w-3/4 p-3 rounded-lg border border-amber-300 focus:outline-amber-500'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='w-3/4 p-3 mt-6 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition'>
                        Login
                    </button>
                </div>
            </div>
            </form>
        </div>
        </>
    )
}