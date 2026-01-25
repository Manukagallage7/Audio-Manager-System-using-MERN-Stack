import { BsGraphDown, BsBoxSeam } from "react-icons/bs";
import { FaRegBookmark, FaRegListAlt, FaRegUser, FaRegStar } from "react-icons/fa";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Items from "../admin/items.jsx";
import Users from "../admin/users.jsx";
import Booking from "../admin/booking.jsx";
import Dashboard from "../admin/dashboard.jsx";
import AddItemPage from "../admin/addItemPage.jsx";
import UpdateItemPage from "../admin/updateItemPage.jsx";
import Reviews from "../admin/reviewPage.jsx";

export default function AdminPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { path: "/adminPage", icon: BsGraphDown, label: "Dashboard" },
        { path: "/adminPage/booking", icon: FaRegBookmark, label: "Bookings" },
        { path: "/adminPage/items", icon: FaRegListAlt, label: "Items" },
        { path: "/adminPage/users", icon: FaRegUser, label: "Users" },
        { path: "/adminPage/reviews", icon: FaRegStar, label: "Reviews" },
    ];

    const isActive = (path) => {
        if (path === "/adminPage") {
            return location.pathname === "/adminPage";
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="w-screen h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-[260px]' : 'w-[80px]'} h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col transition-all duration-300 shadow-xl`}>
                {/* Logo Section */}
                <div className="p-5 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <BsBoxSeam className="text-white text-xl" />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-white font-bold text-lg">Audio Manager</h1>
                                <p className="text-slate-400 text-xs">Admin Panel</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toggle Button */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute top-5 right-[-12px] w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-lg z-10"
                    style={{ left: sidebarOpen ? '248px' : '68px' }}
                >
                    {sidebarOpen ? <FiX size={12} /> : <FiMenu size={12} />}
                </button>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {sidebarOpen && (
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-4">Main Menu</p>
                    )}
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    active 
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                }`}
                            >
                                <Icon className={`text-xl flex-shrink-0 ${active ? 'text-white' : 'group-hover:text-indigo-400'}`} />
                                {sidebarOpen && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                                {active && sidebarOpen && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-slate-700/50">
                    <button 
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}
                    >
                        <FiLogOut className="text-xl flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
                <Routes path="/*">
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/items/add" element={<AddItemPage />} />
                    <Route path="/items/update" element={<UpdateItemPage />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/reviews" element={<Reviews />} />
                </Routes>
            </div>
        </div>
    )
}