import { Route, Routes } from 'react-router-dom';
import Header from '../components/header.jsx';
import Items from '../home/items.jsx';
import Gallery from '../home/gallery.jsx';
import Contact from '../home/contact.jsx';
import About from '../home/about.jsx';
import Home from '../home/home.jsx';
import ProductOverview from '../home/productOverview.jsx';

export default function HomePage() {
    return (
        <>
            <Header />
            <div className='h-[calc(100vh-100px)] w-full'>
                <Routes path="/*">
                    <Route path="/" element={<Home />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/items/:key" element={<ProductOverview />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<h1>404: Page Not Found</h1>} />
                </Routes>
            </div>
        </>
    )
}