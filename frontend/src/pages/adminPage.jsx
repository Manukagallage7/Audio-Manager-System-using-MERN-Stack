import { BsGraphDown } from "react-icons/bs";
import { FaRegBookmark, FaRegListAlt, FaRegUser } from "react-icons/fa";
import { Route, Routes, Link } from "react-router-dom";
import Items from "../admin/items.jsx";
import Users from "../admin/users.jsx";
import Booking from "../admin/booking.jsx";
import Dashboard from "../admin/dashboard.jsx";
import AddItemPage from "../admin/addItemPage.jsx";
import UpdateItemPage from "../admin/updateItemPage.jsx";

export default function AdminPage() {
    return (
        <div className="w-screen h-screen flex">
            <div className="w-[200px] h-full bg-green-300 items-center  flex flex-col gap-5 pt-20 md:gap-10">
                <Link to="/adminPage" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><BsGraphDown/>Dashboard</Link>
                <Link to="/adminPage/booking" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><FaRegBookmark />Booking</Link>
                <Link to="/adminPage/items" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><FaRegListAlt />Items</Link>
                <Link to="/adminPage/users" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><FaRegUser /> Users</Link>
            </div>
            <div className="w-[calc(100vw-200px)] bg-blue-300">
                <Routes path="/*">
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/items/add" element={<AddItemPage />} />
                    <Route path="/items/update" element={<UpdateItemPage />} />
                    <Route path="/users" element={<Users />} />
                </Routes>
            </div>
        </div>
    )
}