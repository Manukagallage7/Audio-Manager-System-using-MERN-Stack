import {Link} from 'react-router-dom';

export default function Header() {
    return (
        <header className='w-full h-[100px] relative bg-blue-800 flex justify-center items-center gap-10'>
            <img src="/logo.png" alt="Logo" className='absolute left-4 w-[80px] h-[80px] object-cover border-1 rounded-full' />
            <Link to="/homePage/home" className='text-white text-3xl font-bold m-1'>Home</Link>
            <Link to="/homePage/items" className='text-white text-3xl font-bold m-1'>Items</Link>
            <Link to="/homePage/gallery" className='text-white text-3xl font-bold m-1'>Gallery</Link>
            <Link to="/homePage/contact" className='text-white text-3xl font-bold m-1'>Contact</Link>
            <Link to="/homePage/about" className='text-white text-3xl font-bold m-1'>About</Link>
        </header>

    )
}